from fastapi import APIRouter

from app.agents.context import AgentContext
from app.agents.orchestrator import Orchestrator
from app.core.security import CurrentUserDependency
from app.schemas.agent import AgentRequest, AgentResponse

router = APIRouter()


@router.post("/chat", response_model=AgentResponse)
async def agent_chat(
    request: AgentRequest,
    current_user: CurrentUserDependency,
) -> AgentResponse:
    """Process a farming query through the AI orchestrator."""
    context = AgentContext(
        user_id=current_user.user_id,
        city=request.city,
        lat=request.lat,
        lon=request.lon,
        commodity=request.commodity,
        conversation_id=request.conversation_id,
    )

    orchestrator = Orchestrator()
    result = await orchestrator.chat(request.message, context)

    return AgentResponse(
        message=result["message"],
        planned_tools=result["planned_tools"],
        tool_results=result["tool_results"],
    )
