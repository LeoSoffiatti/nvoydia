@echo off
REM NCP Dashboard Local Server Startup Script for Windows
REM This script starts the dashboard on localhost:2000

echo 🚀 Starting NCP Dashboard on localhost:2000...
echo 📁 Serving files from: %CD%
echo 🌐 Dashboard will be available at: http://localhost:2000
echo.
echo Press Ctrl+C to stop the server
echo ----------------------------------------

REM Start the Python HTTP server
python -m http.server 2000
