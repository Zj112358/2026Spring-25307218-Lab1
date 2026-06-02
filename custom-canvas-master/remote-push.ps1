param(
  [Parameter(Mandatory=$true)]
  [string]$RemoteIP,
  [int]$Port = 5555,
  [int]$Port2 = 5557
)

$ErrorActionPreference = "Continue"
$hdc = "D:\DevEco Studio\sdk\default\openharmony\toolchains\hdc.exe"

if (-not (Test-Path $hdc)) {
  $envHdc = Get-Command hdc.exe -ErrorAction SilentlyContinue
  if ($envHdc) { $hdc = $envHdc.Source }
  else { Write-Host "[ERROR] hdc not found!" -ForegroundColor Red; exit 1 }
}

$hap = "D:\open\custom-canvas-master2\custom-canvas-master\entry\build\default\outputs\default\entry-default-unsigned.hap"
if (-not (Test-Path $hap)) {
  Write-Host "[ERROR] HAP not found: $hap" -ForegroundColor Red
  exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Remote Install (No File Transfer)    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Remote: $RemoteIP" -ForegroundColor White
Write-Host "HAP: $hap" -ForegroundColor White
Write-Host ""

$ports = @($Port)
if ($Port2 -gt 0) { $ports += $Port2 }

foreach ($p in $ports) {
  $target = "${RemoteIP}:${p}"
  Write-Host "--- Connecting to $target ---" -ForegroundColor Yellow
  & $hdc tconn $target 2>&1 | ForEach-Object { Write-Host "  $_" }
  Start-Sleep -Seconds 2

  Write-Host "  Installing..." -ForegroundColor White
  & $hdc -t $target install $hap 2>&1 | ForEach-Object { Write-Host "  $_" }

  Write-Host "  Launching..." -ForegroundColor White
  & $hdc -t $target shell aa start -a EntryAbility -b com.example.customcanvas 2>&1 | ForEach-Object { Write-Host "  $_" }

  Write-Host "  Disconnecting..." -ForegroundColor White
  & $hdc tdisconn $target 2>&1 | ForEach-Object { Write-Host "  $_" }
  Write-Host ""
}

Write-Host "Done!" -ForegroundColor Green
