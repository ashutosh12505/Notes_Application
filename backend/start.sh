#!/usr/bin/env bash
# Startup script for Render.com
# This ensures migrations are run before starting the server

set -o errexit  # Exit on error

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Starting Gunicorn..."
exec gunicorn backend.wsgi:application

