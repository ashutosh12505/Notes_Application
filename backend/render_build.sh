#!/usr/bin/env bash
# Build script for Render.com
# This runs migrations and collects static files during build

set -o errexit  # Exit on error

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build completed successfully!"

