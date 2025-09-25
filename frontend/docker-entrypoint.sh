#!/bin/sh

# Replace environment variables in config template
envsubst '${API_URL} ${API_HOST} ${API_PORT}' < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js

# Start nginx
exec "$@"
