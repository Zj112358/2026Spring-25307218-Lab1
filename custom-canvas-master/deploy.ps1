# 跨主机传输安装脚本
# 用法:
#   本地安装:     .\deploy.ps1
#   远程安装:     .\deploy.ps1 -RemoteIP 192.168.1.100 -User admin
#   指定设备:     .\deploy.ps1 -Target 127.0.0.1:5557
#   远程+指定设备: .\deploy.ps1 -RemoteIP 192.168.1.100 -User admin -Target 127.0.0.1:5555

param(
    [string]$RemoteIP = "",
    [string]$User = "user",
    [string]$Target = "",
    [string]$BundleName = "com.example.customcanvas",
    [string]$AbilityName = "EntryAbility"
)

$ErrorActionPreference = "Stop"

# hdc 路径
$HdcPath = "D:\DevEco Studio\sdk\default\openharmony\toolchains\hdc.exe"
if (-not (Test-Path $HdcPath)) {
    $HdcPath = "hdc"
}

# HAP 路径
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$HapDir = Join-Path $ProjectRoot "entry\build\default\outputs\default"

# 查找 HAP 文件（优先 signed，其次 unsigned）
$HapFile = Join-Path $HapDir "entry-default-signed.hap"
if (-not (Test-Path $HapFile)) {
    $HapFile = Join-Path $HapDir "entry-default-unsigned.hap"
}
if (-not (Test-Path $HapFile)) {
    Write-Host "[错误] 未找到 HAP 文件，请先构建项目: Build -> Build Hap(s)" -ForegroundColor Red
    Write-Host "  期望路径: $HapDir\entry-default-*.hap" -ForegroundColor Yellow
    exit 1
}

$HapName = Split-Path -Leaf $HapFile
Write-Host "[信息] HAP 文件: $HapName ($(math::Round((Get-Item $HapFile).Length / 1024))KB)" -ForegroundColor Cyan

# 构建 hdc 命令前缀
function Get-HdcCmd {
    param([string]$TargetId)
    if ($TargetId -ne "") {
        return "hdc -t $TargetId"
    }
    return "hdc"
}

# 本地部署
function Deploy-Local {
    param([string]$TargetId)
    
    $hdc = Get-HdcCmd $TargetId
    
    Write-Host "`n[步骤1] 查看已连接设备..." -ForegroundColor Green
    $devices = & hdc list targets 2>&1
    Write-Host "  设备列表: $devices" -ForegroundColor White
    
    Write-Host "[步骤2] 安装 HAP..." -ForegroundColor Green
    $installCmd = "$hdc install `"$HapFile`""
    Write-Host "  执行: $installCmd" -ForegroundColor Gray
    $result = Invoke-Expression $installCmd 2>&1
    Write-Host "  结果: $result" -ForegroundColor White
    
    Write-Host "[步骤3] 启动应用..." -ForegroundColor Green
    $startCmd = "$hdc shell aa start -a $AbilityName -b $BundleName"
    Write-Host "  执行: $startCmd" -ForegroundColor Gray
    $result = Invoke-Expression $startCmd 2>&1
    Write-Host "  结果: $result" -ForegroundColor White
    
    Write-Host "`n[完成] 本地部署成功!" -ForegroundColor Green
}

# 远程部署
function Deploy-Remote {
    param(
        [string]$IP,
        [string]$UserName,
        [string]$TargetId
    )
    
    $RemoteHapPath = "/tmp/$HapName"
    
    Write-Host "`n[步骤1] 传输 HAP 到远程主机 $IP..." -ForegroundColor Green
    Write-Host "  执行: scp `"$HapFile`" ${UserName}@${IP}:${RemoteHapPath}" -ForegroundColor Gray
    scp $HapFile "${UserName}@${IP}:${RemoteHapPath}"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] SCP 传输失败，请确认:" -ForegroundColor Red
        Write-Host "  1. 远程主机已开启 SSH 服务" -ForegroundColor Yellow
        Write-Host "  2. IP 地址和用户名正确" -ForegroundColor Yellow
        Write-Host "  3. 网络连通 (ping $IP)" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "  传输成功!" -ForegroundColor White
    
    # 构建 hdc 前缀
    $hdcPrefix = "hdc"
    if ($TargetId -ne "") {
        $hdcPrefix = "hdc -t $TargetId"
    }
    
    Write-Host "[步骤2] 远程安装 HAP..." -ForegroundColor Green
    $installCmd = "ssh ${UserName}@${IP} `"$hdcPrefix install $RemoteHapPath`""
    Write-Host "  执行: $installCmd" -ForegroundColor Gray
    $result = Invoke-Expression $installCmd 2>&1
    Write-Host "  结果: $result" -ForegroundColor White
    
    Write-Host "[步骤3] 远程启动应用..." -ForegroundColor Green
    $startCmd = "ssh ${UserName}@${IP} `"$hdcPrefix shell aa start -a $AbilityName -b $BundleName`""
    Write-Host "  执行: $startCmd" -ForegroundColor Gray
    $result = Invoke-Expression $startCmd 2>&1
    Write-Host "  结果: $result" -ForegroundColor White
    
    Write-Host "[步骤4] 清理远程临时文件..." -ForegroundColor Green
    ssh "${UserName}@${IP}" "rm -f $RemoteHapPath" 2>$null
    
    Write-Host "`n[完成] 远程部署成功!" -ForegroundColor Green
}

# 主逻辑
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Custom Canvas 跨设备部署工具" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

if ($RemoteIP -ne "") {
    Deploy-Remote -IP $RemoteIP -UserName $User -TargetId $Target
} else {
    Deploy-Local -TargetId $Target
}
