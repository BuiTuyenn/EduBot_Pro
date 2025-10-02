#!/bin/bash

echo "==================================="
echo "Starting Educational Chatbot AI"
echo "==================================="
echo ""

# Activate virtual environment if exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Starting Flask server on port 5000..."
echo ""
python app.py

