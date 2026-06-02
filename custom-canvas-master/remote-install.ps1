param(
  [string]$HapPath = ""
)

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Custom Canvas Remote Auto Installer  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$hdc = $null
$hdcPaths = @(
  "D:\DevEco Studio\sdk\default\openharmony\toolchains\hdc.exe",
  "C:\DevEco Studio\sdk\default\openharmony\toolchains\hdc.exe",
  "$env:LOCALAPPDATA\Huawei\Sdk\openharmony\toolchains\hdc.exe"
)

$sdkDirs = Get-ChildItem -Path "D:\DevEco Studio\sdk" -Directory -ErrorAction SilentlyContinue
if ($sdkDirs) {
  foreach ($dir in $sdkDirs) {
    $p = Join-Path $dir.FullName "openharmony\toolchains\hdc.exe"
    if (Test-Path $p) { $hdcPaths += $p }
  }
}

$sdkDirs = Get-ChildItem -Path "C:\DevEco Studio\sdk" -Directory -ErrorAction SilentlyContinue
if ($sdkDirs) {
  foreach ($dir in $sdkDirs) {
    $p = Join-Path $dir.FullName "openharmony\toolchains\hdc.exe"
    if (Test-Path $p) { $hdcPaths += $p }
  }
}

foreach ($path in $hdcPaths) {
  if (Test-Path $path) {
    $hdc = $path
    Write-Host "[OK] Found hdc: $hdc" -ForegroundColor Green
    break
  }
}

if (-not $hdc) {
  $envHdc = Get-Command hdc.exe -ErrorAction SilentlyContinue
  if ($envHdc) {
    $hdc = $envHdc.Source
    Write-Host "[OK] Found hdc in PATH: $hdc" -ForegroundColor Green
  }
}

if (-not $hdc) {
  Write-Host "[ERROR] hdc not found! Please install DevEco Studio first." -ForegroundColor Red
  Write-Host "Download: https://developer.huawei.com/consumer/cn/deveco-studio/" -ForegroundColor Yellow
  Read-Host "Press Enter to exit"
  exit 1
}

Write-Host ""
Write-Host "--- Step 1: Detecting devices ---" -ForegroundColor Yellow
& $hdc list targets 2>&1 | ForEach-Object {
  if ($_ -match '^\d') {
    Write-Host "  Device: $_" -ForegroundColor White
  }
}

$targets = & $hdc list targets 2>&1 | Where-Object { $_ -match '^\d' }
if ($targets.Count -eq 0) {
  Write-Host "[ERROR] No devices found! Please start an emulator first." -ForegroundColor Red
  Read-Host "Press Enter to exit"
  exit 1
}

Write-Host ""
Write-Host "--- Step 2: Finding HAP file ---" -ForegroundColor Yellow

if (-not $HapPath -or -not (Test-Path $HapPath)) {
  $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
  $searchPaths = @(
    (Join-Path $scriptDir "entry-default-unsigned.hap"),
    (Join-Path $scriptDir "entry-default-signed.hap"),
    (Join-Path $scriptDir "entry\build\default\outputs\default\entry-default-unsigned.hap"),
    (Join-Path $scriptDir "entry\build\default\outputs\default\entry-default-signed.hap"),
    (Join-Path $scriptDir "..\entry\build\default\outputs\default\entry-default-unsigned.hap"),
    (Join-Path $scriptDir "..\entry\build\default\outputs\default\entry-default-signed.hap")
  )

  foreach ($p in $searchPaths) {
    if (Test-Path $p) {
      $HapPath = $p
      break
    }
  }

  $foundHaps = Get-ChildItem -Path $scriptDir -Filter "*.hap" -Recurse -ErrorAction SilentlyContinue
  if (-not $HapPath -and $foundHaps) {
    $HapPath = $foundHaps[0].FullName
  }
}

if (-not $HapPath -or -not (Test-Path $HapPath)) {
  Write-Host "[ERROR] HAP file not found!" -ForegroundColor Red
  Write-Host "Usage: .\remote-install.ps1 -HapPath <path-to-hap>" -ForegroundColor Yellow
  Read-Host "Press Enter to exit"
  exit 1
}

Write-Host "[OK] HAP: $HapPath" -ForegroundColor Green

Write-Host ""
Write-Host "--- Step 3: Installing to all devices ---" -ForegroundColor Yellow

foreach ($target in $targets) {
  $target = $target.Trim()
  if ($target -match '^\d') {
    Write-Host "  Installing to $target ..." -ForegroundColor White
    & $hdc -t $target install $HapPath 2>&1 | ForEach-Object {
      if ($_ -match 'successfully') {
        Write-Host "    [OK] $_" -ForegroundColor Green
      } else {
        Write-Host "    $_"
      }
    }
  }
}

Write-Host ""
Write-Host "--- Step 4: Launching app ---" -ForegroundColor Yellow

foreach ($target in $targets) {
  $target = $target.Trim()
  if ($target -match '^\d') {
    Write-Host "  Launching on $target ..." -ForegroundColor White
    & $hdc -t $target shell aa start -a EntryAbility -b com.example.customcanvas 2>&1 | ForEach-Object {
      if ($_ -match 'successfully') {
        Write-Host "    [OK] $_" -ForegroundColor Green
      } else {
        Write-Host "    $_"
      }
    }
  }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation Complete!               " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit"
