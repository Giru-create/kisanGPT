FROM python:3.11-slim AS base

# Security: set realistic timezone, avoid running as root
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

COPY pyproject.toml ./
RUN pip install --no-cache-dir .

FROM base AS development
COPY . .
RUN pip install --no-cache-dir ".[dev]"
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM base AS production
COPY . .
RUN pip install --no-cache-dir .

# Security: create non-root user
RUN groupadd -r kisangpt && useradd -r -g kisangpt -d /app -s /sbin/nologin kisangpt \
    && chown -R kisangpt:kisangpt /app
USER kisangpt

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["python", "-c", "import httpx; r = httpx.get('http://localhost:8000/api/v1/health'); r.raise_for_status()"]

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
