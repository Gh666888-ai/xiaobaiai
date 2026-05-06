@echo off
title Claude Bridge
cd /d E:\ai导航网站
start "Bridge" cmd /c "node agent-bridge.js"
timeout /t 2 /nobreak >nul
node clawx-daemon.js
