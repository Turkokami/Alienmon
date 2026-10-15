@echo off
rem Apply map-editor changes: rebuild, check, and publish to the maps-v2 test link.
cd /d "%~dp0..\.."
python tools\editor\apply.py --push
pause
