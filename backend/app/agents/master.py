"""Master agent -- orchestrates the multi-agent pipeline."""

from __future__ import annotations

import asyncio
import time
from typing import Any

from app.agents.context import AgentContext
from app.agents.response_agent import ResponseAgent
from app.agents.router import AgentRouter
from app.agents.schemas import AgentMetrics, AgentResult
from app.core.logging import logger


class MasterAgent:
    """Entry point for the multi-agent pipeline.

    Workflow:
        1. Build shared AgentContext from the request.
        2. Ask AgentRouter which agents are needed.
        3. Execute them (independent agents in parallel).
        4. Merge outputs into the context.
        5. Call ResponseAgent to generate the final answer.
        6. Return the final response.

    The public API endpoint calls MasterAgent instead of directly
    calling Executor, maintaining backward compatibility.
    """

    def __init__(
        self,
        agent_router: AgentRouter | None = None,
        response_agent: ResponseAgent | None = None,
        llm_provider: Any | None = None,
        memory_manager: Any | None = None,
    ) -> None:
        self._router = agent_router or AgentRouter(llm_provider=llm_provider)
        self._response_agent = response_agent or ResponseAgent(provider=llm_provider)
        self._provider = llm_provider
        self._memory_manager = memory_manager
        self._metrics: list[AgentMetrics] = []

        # Register default specialist agents if the router is empty
        if not self._router.list_agents():
            self._register_default_agents()

    @property
    def metrics(self) -> list[AgentMetrics]:
        """Expose collected metrics for observability."""
        return list(self._metrics)

    def _register_default_agents(self) -> None:
        """Register the built-in specialist agents."""
        from app.agents.disease_agent import DiseaseAgent
        from app.agents.knowledge_agent import KnowledgeAgent
        from app.agents.market_agent import MarketAgent
        from app.agents.memory_agent import MemoryAgent
        from app.agents.weather_agent import WeatherAgent

        for agent_cls in [
            WeatherAgent,
            MarketAgent,
            DiseaseAgent,
            KnowledgeAgent,
            MemoryAgent,
        ]:
            self._router.register(agent_cls())

    async def chat(
        self,
        message: str,
        context: AgentContext | None = None,
    ) -> dict[str, Any]:
        """Process a user message through the multi-agent pipeline.

        Returns:
            Dict with ``message`` (natural-language), ``planned_tools``,
            ``tool_results``, ``context``, and ``overall_confidence``.
        """
        start = time.time()
        ctx = context or AgentContext()
        ctx.message = message

        logger.info(
            "MasterAgent.chat started",
            extra={"user_id": ctx.user_id, "user_message": message[:80]},
        )

        # Step 1: Load memory
        memory_context = await self._load_memory(ctx.user_id)
        if memory_context:
            ctx.memory = memory_context

        # Step 2: Route to agents
        agent_names = await self._router.route(message)
        logger.info(
            "MasterAgent routed to agents",
            extra={"agents": agent_names},
        )

        # Step 3: Execute agents (parallel for independent ones)
        agent_results = await self._execute_agents(agent_names, ctx)

        # Step 4: Merge results into context
        self._merge_into_context(agent_results, ctx)

        # Step 5: Generate response
        answer = await self._response_agent.generate(message, agent_results, ctx)

        # Step 6: Save memory
        await self._save_memory(ctx.user_id, message, answer)

        # Compute overall confidence
        overall_confidence = self._compute_confidence(agent_results)

        elapsed_ms = (time.time() - start) * 1000
        logger.info(
            "MasterAgent.chat completed",
            extra={
                "elapsed_ms": round(elapsed_ms, 1),
                "overall_confidence": overall_confidence,
                "agents_executed": len(agent_results),
            },
        )

        # Build tool_results for backward compat
        tool_results = [r.to_tool_result() for r in agent_results]
        planned_tools = [r.name for r in agent_results]

        return {
            "message": answer,
            "planned_tools": planned_tools,
            "tool_results": tool_results,
            "context": {
                "query": ctx.message,
                "knowledge": ctx.documents,
                "memory": ctx.memory,
            },
            "overall_confidence": overall_confidence,
            "agent_metrics": [
                m.model_dump() for m in self._metrics[-len(agent_names) :]
            ],
        }

    async def _execute_agents(
        self,
        agent_names: list[str],
        context: AgentContext,
    ) -> list[AgentResult]:
        """Execute the selected agents, running independent ones in parallel.

        Returns:
            List of AgentResult objects for backward compat with response agent.
            Metrics are stored separately in self._metrics.
        """
        if not agent_names:
            return []

        agents = [self._router.get(n) for n in agent_names]
        agents = [a for a in agents if a is not None]

        tasks = [self._run_single_agent(a, context) for a in agents]
        outcomes = await asyncio.gather(*tasks, return_exceptions=True)

        final_metrics: list[AgentMetrics] = []
        final_results: list[AgentResult] = []

        for i, outcome in enumerate(outcomes):
            agent_name = agents[i].name
            if isinstance(outcome, Exception):
                metrics = AgentMetrics(agent_name=agent_name, success=False)
                metrics.mark_finished(False, str(outcome))
                result = AgentResult(
                    name=agent_name,
                    success=False,
                    confidence=0.0,
                    errors=[str(outcome)],
                )
                logger.warning(
                    "Agent raised exception",
                    extra={"agent": agent_name, "error": str(outcome)},
                )
            else:
                metrics, result = outcome

            final_metrics.append(metrics)
            if result is not None:
                final_results.append(result)

        self._metrics.extend(final_metrics)
        return final_results

    async def _run_single_agent(
        self,
        agent: Any,
        context: AgentContext,
    ) -> tuple[AgentMetrics, AgentResult | None]:
        """Execute a single agent with retry logic and timeout.

        Returns:
            Tuple of (AgentMetrics, AgentResult | None).
            AgentResult is None only on unrecoverable failure.
        """
        metrics = AgentMetrics(agent_name=agent.name)
        config = agent.config
        last_error: str | None = None

        for attempt in range(1 + config.max_retries):
            try:
                logger.info(
                    "Agent started",
                    extra={"agent": agent.name, "attempt": attempt + 1},
                )

                result = await asyncio.wait_for(
                    agent.run(context),
                    timeout=config.timeout_seconds,
                )

                metrics.mark_finished(result.success)
                logger.info(
                    "Agent finished",
                    extra={
                        "agent": agent.name,
                        "success": result.success,
                        "confidence": result.confidence,
                        "duration_ms": round(metrics.duration_ms, 1),
                    },
                )

                self._enrich_context_from_result(agent.name, result, context)
                return metrics, result

            except TimeoutError:
                last_error = f"{agent.name} timed out after {config.timeout_seconds}s"
                metrics.retry_count = attempt + 1
                logger.warning(
                    "Agent timed out, retrying",
                    extra={"agent": agent.name, "attempt": attempt + 1},
                )
            except Exception as exc:
                last_error = str(exc)
                metrics.retry_count = attempt + 1
                logger.warning(
                    "Agent failed, retrying",
                    extra={
                        "agent": agent.name,
                        "attempt": attempt + 1,
                        "error": str(exc),
                    },
                )

        metrics.mark_finished(False, last_error)
        fallback = AgentResult(
            name=agent.name,
            success=False,
            confidence=0.0,
            errors=[last_error] if last_error else [],
        )
        return metrics, fallback

    def _enrich_context_from_result(
        self,
        agent_name: str,
        result: AgentResult,
        context: AgentContext,
    ) -> None:
        """Enrich the shared context based on agent results."""
        if not result.success:
            return

        if agent_name == "weather":
            context.weather = result.data
        elif agent_name == "market":
            context.market = result.data
        elif agent_name == "disease":
            context.diagnosis = result.data
        elif agent_name == "knowledge":
            context.documents = result.data.get("documents", [])
        elif agent_name == "memory":
            context.history = result.data.get("messages", [])

    def _merge_into_context(
        self,
        agent_results: list[AgentResult],
        context: AgentContext,
    ) -> None:
        """Merge all agent outputs into the shared context."""
        context.metadata["agents_executed"] = [r.name for r in agent_results]
        context.metadata["overall_success"] = all(r.success for r in agent_results)

    @staticmethod
    def _compute_confidence(agent_results: list[AgentResult]) -> float:
        """Compute weighted average confidence from agent results."""
        if not agent_results:
            return 0.0

        total = 0.0
        count = 0
        for r in agent_results:
            if r.success:
                total += 1.0
            count += 1

        return round(total / count, 3) if count > 0 else 0.0

    async def _load_memory(self, user_id: str) -> dict[str, Any] | None:
        """Load farmer memory if available."""
        if not self._memory_manager or not user_id:
            return None
        try:
            memory_ctx = await self._memory_manager.retrieve_memory(user_id)
            return memory_ctx.model_dump()
        except Exception as exc:
            logger.warning(
                "Failed to load memory",
                extra={"user_id": user_id, "error": str(exc)},
            )
            return None

    async def _save_memory(
        self,
        user_id: str,
        user_message: str,
        assistant_message: str,
    ) -> None:
        """Save conversation to memory if available."""
        if not self._memory_manager or not user_id:
            return
        try:
            await self._memory_manager.save_conversation_message(
                user_id, "user", user_message
            )
            await self._memory_manager.save_conversation_message(
                user_id, "assistant", assistant_message
            )
            await self._memory_manager.save_memory(user_id, user_message)
        except Exception as exc:
            logger.warning(
                "Failed to save memory",
                extra={"user_id": user_id, "error": str(exc)},
            )
