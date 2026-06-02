@echo off
echo Running remote-install.ps1...
powershell -ExecutionPolicy Bypass -File "%~dp0remote-install.ps1" %*
pause
