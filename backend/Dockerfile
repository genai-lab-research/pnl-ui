FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy project files
COPY pyproject.toml uv.lock ./

# Install Python dependencies
RUN uv sync --frozen --no-cache

# Copy project
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p /tmp /app/.uv-cache \
    && chmod -R 777 /tmp \
    && chmod -R 777 /app/.uv-cache

# Don't use a non-root user for Azure App Service
# Azure handles this at the platform level

ENV UV_CACHE_DIR=/tmp/.uv-cache
ENV PORT=8000

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Use the PORT environment variable that Azure sets
CMD ["sh", "-c", "uv run uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]