#!/bin/sh
set -e

# Function to replace environment variables in nginx config
replace_env_vars() {
    # If BACKEND_URL is not set, use empty string
    export BACKEND_URL="${BACKEND_URL:-}"
    
    echo "Configuring nginx with BACKEND_URL: ${BACKEND_URL:-'not set'}"
    
    # Replace environment variables in the template
    envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf
    
    # Remove the template file
    rm -f /etc/nginx/conf.d/nginx.conf.template
}

# Replace environment variables
replace_env_vars

# Execute the original nginx command
exec "$@"