#!/bin/bash
set -e

# Azure App Service startup script
echo "Starting FastAPI application on Azure App Service"

# Set the port from Azure's PORT environment variable
export PORT=${PORT:-8000}

# Azure-specific optimizations
export PYTHONUNBUFFERED=1
export AZURE_LOGGING_LEVEL=${AZURE_LOGGING_LEVEL:-info}

# Log environment info
echo "=== Environment Info ==="
echo "PORT: $PORT"
echo "WEBSITE_HOSTNAME: ${WEBSITE_HOSTNAME:-not set}"
echo "DATABASE_URL: ${DATABASE_URL:+[REDACTED]}"
echo "AZURE_POSTGRESQL_CONNECTIONSTRING: ${AZURE_POSTGRESQL_CONNECTIONSTRING:+[REDACTED]}"
echo "DB_POOL_SIZE: ${DB_POOL_SIZE:-10}"
echo "DB_CONNECT_TIMEOUT: ${DB_CONNECT_TIMEOUT:-30}"
echo "DB_STARTUP_RETRIES: ${DB_STARTUP_RETRIES:-10}"
echo "======================="

# Ensure proper Python path
export PYTHONPATH=/app:$PYTHONPATH

# Handle graceful shutdown
trap 'echo "Received SIGTERM, shutting down gracefully..."; kill -TERM $PID; wait $PID' SIGTERM

# Run the application with proper timeout and workers configuration
# Use --timeout-keep-alive to handle Azure's load balancer timeouts
echo "Starting uvicorn server..."
uv run uvicorn app.main:app \
    --host 0.0.0.0 \
    --port $PORT \
    --workers ${WORKERS:-1} \
    --timeout-keep-alive ${TIMEOUT_KEEP_ALIVE:-120} \
    --timeout-graceful-shutdown ${TIMEOUT_GRACEFUL_SHUTDOWN:-30} \
    --access-log \
    --log-level ${AZURE_LOGGING_LEVEL} \
    --proxy-headers \
    --forwarded-allow-ips "*" &

PID=$!

# Wait for the uvicorn process
wait $PID