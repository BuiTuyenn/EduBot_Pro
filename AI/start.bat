@echo off
echo ===================================
echo Starting Educational Chatbot AI
echo ===================================
echo.

REM Activate virtual environment if exists
if exist venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting Flask server on port 5000...
echo.
python app.py

pause

