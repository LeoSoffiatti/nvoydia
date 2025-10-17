#!/bin/bash

# NCP Dashboard Local Server Startup Script
# This script starts the dashboard on localhost:2000

echo "🚀 Starting NCP Dashboard on localhost:2000..."
echo "📁 Serving files from: $(pwd)"
echo "🌐 Dashboard will be available at: http://localhost:2000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

# Start the Python HTTP server
python3 -m http.server 2000
