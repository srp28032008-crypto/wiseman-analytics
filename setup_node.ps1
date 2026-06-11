# setup_node.ps1 - Automated Portable Node.js Installer & Runner
$ErrorActionPreference = "Stop"

$nodeUrl = "https://nodejs.org/dist/v20.12.2/node-v20.12.2-win-x64.zip"
$zipFile = "node.zip"
$destFolder = "node-bin"

$currentDir = Get-Location

# Step 1: Download portable Node.js zip
if (-not (Test-Path $zipFile)) {
    Write-Output "Downloading portable Node.js runtime (v20.12.2)... Please wait, this might take a minute."
    Invoke-WebRequest -Uri $nodeUrl -OutFile $zipFile -UseBasicParsing
} else {
    Write-Output "Node.js archive already downloaded."
}

# Step 2: Extract archive
if (-not (Test-Path $destFolder)) {
    Write-Output "Extracting Node.js archive..."
    New-Item -ItemType Directory -Force -Path $destFolder | Out-Null
    Expand-Archive -Path $zipFile -DestinationPath $destFolder
} else {
    Write-Output "Node.js already extracted in $destFolder."
}

# Locate binary files
$nodeRoot = Join-Path $currentDir "$destFolder\node-v20.12.2-win-x64"
$nodeExe = Join-Path $nodeRoot "node.exe"
$npmCli = Join-Path $nodeRoot "node_modules\npm\bin\npm-cli.js"

if (-not (Test-Path $nodeExe)) {
    Write-Error "node.exe not found at $nodeExe"
    exit
}

Write-Output "Verified Node.js runtime: $nodeExe"

# Step 3: Install backend dependencies
Write-Output "Installing backend dependencies..."
Push-Location backend

# Run local npm-cli to install dependencies
& $nodeExe $npmCli install

Pop-Location
Write-Output "Dependencies installed successfully!"

# Step 4: Run server
Write-Output "Starting Wiseman Analytics Cloud Server..."
Push-Location backend
& $nodeExe server.js
Pop-Location
