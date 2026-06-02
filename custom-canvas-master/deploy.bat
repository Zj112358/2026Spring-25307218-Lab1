@echo off
chcp 65001 >nul
echo ======================================
echo   Custom Canvas 跨设备部署工具
echo ======================================
echo.
echo 请选择部署方式:
echo   1. 本地安装 (当前主机模拟器)
echo   2. 远程安装 (另一台主机模拟器)
echo   3. 查看已连接设备
echo   4. 构建HAP包
echo.
set /p choice=请输入选项 (1-4): 

if "%choice%"=="1" goto local
if "%choice%"=="2" goto remote
if "%choice%"=="3" goto devices
if "%choice%"=="4" goto build
goto end

:local
echo.
set /p target=请输入目标设备ID (留空则自动选择): 
if "%target%"=="" (
    hdc install entry\build\default\outputs\default\entry-default-signed.hap 2>nul
    if errorlevel 1 hdc install entry\build\default\outputs\default\entry-default-unsigned.hap
) else (
    hdc -t %target% install entry\build\default\outputs\default\entry-default-signed.hap 2>nul
    if errorlevel 1 hdc -t %target% install entry\build\default\outputs\default\entry-default-unsigned.hap
)
if "%target%"=="" (
    hdc shell aa start -a EntryAbility -b com.example.customcanvas
) else (
    hdc -t %target% shell aa start -a EntryAbility -b com.example.customcanvas
)
echo.
echo 本地部署完成!
goto end

:remote
echo.
set /p ip=请输入远程主机IP: 
set /p user=请输入远程用户名 (默认root): 
if "%user%"=="" set user=root
set /p target=请输入目标设备ID (留空则自动选择): 
echo.
echo [1] 传输 HAP 到远程主机...
scp entry\build\default\outputs\default\entry-default-signed.hap %user%@%ip%:/tmp/ 2>nul
if errorlevel 1 scp entry\build\default\outputs\default\entry-default-unsigned.hap %user%@%ip%:/tmp/
echo [2] 远程安装 HAP...
if "%target%"=="" (
    ssh %user%@%ip% "hdc install /tmp/entry-default-signed.hap 2>/dev/null || hdc install /tmp/entry-default-unsigned.hap"
) else (
    ssh %user%@%ip% "hdc -t %target% install /tmp/entry-default-signed.hap 2>/dev/null || hdc -t %target% install /tmp/entry-default-unsigned.hap"
)
echo [3] 远程启动应用...
if "%target%"=="" (
    ssh %user%@%ip% "hdc shell aa start -a EntryAbility -b com.example.customcanvas"
) else (
    ssh %user%@%ip% "hdc -t %target% shell aa start -a EntryAbility -b com.example.customcanvas"
)
echo [4] 清理临时文件...
ssh %user%@%ip% "rm -f /tmp/entry-default-*.hap" 2>nul
echo.
echo 远程部署完成!
goto end

:devices
echo.
echo 已连接设备列表:
hdc list targets
echo.
goto end

:build
echo.
echo 构建 HAP 包...
call hvigorw assembleHap --mode module -p module=entry@default
echo.
echo 构建完成!
goto end

:end
pause
