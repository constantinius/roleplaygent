FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

COPY . /app

RUN uv sync --locked --no-install-project --no-dev

ENV PATH="/app/.venv/bin:$PATH"

CMD ["uvicorn", "roleplaygent_agent.api:app", "--host", "0.0.0.0", "--port", "80"]
