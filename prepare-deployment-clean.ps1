# Script para preparar archivos para subida a Hostinger
# Crea archivos ZIP separados para frontend y backend

Write-Host "Preparando archivos para deployment en Hostinger..." -ForegroundColor Green

# Crear carpeta de deployment si no existe
if (!(Test-Path "deployment")) {
    New-Item -ItemType Directory -Name "deployment"
    Write-Host "Carpeta deployment creada" -ForegroundColor Yellow
}

# Comprimir frontend (contenido de dist)
Write-Host "Comprimiendo frontend..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Compress-Archive -Path "dist\*" -DestinationPath "deployment\frontend.zip" -Force
    Write-Host "Frontend comprimido: deployment\frontend.zip" -ForegroundColor Green
} else {
    Write-Host "Error: Carpeta dist no encontrada. Ejecuta 'npm run build' primero." -ForegroundColor Red
    exit 1
}

# Comprimir backend (buscar en carpeta padre)
Write-Host "Comprimiendo backend..." -ForegroundColor Cyan
$backendPath = "..\backend"
if (Test-Path $backendPath) {
    Compress-Archive -Path "$backendPath\*" -DestinationPath "deployment\backend.zip" -Force
    Write-Host "Backend comprimido: deployment\backend.zip" -ForegroundColor Green
} else {
    Write-Host "Error: Carpeta backend no encontrada en $backendPath" -ForegroundColor Red
    Write-Host "Buscando backend en ubicaciones alternativas..." -ForegroundColor Yellow
    
    # Buscar en otras ubicaciones posibles
    $locations = @("backend", ".\backend", "..\Shop-dropping\backend")
    $found = $false
    
    foreach ($loc in $locations) {
        if (Test-Path $loc) {
            Write-Host "Backend encontrado en: $loc" -ForegroundColor Green
            Compress-Archive -Path "$loc\*" -DestinationPath "deployment\backend.zip" -Force
            Write-Host "Backend comprimido: deployment\backend.zip" -ForegroundColor Green
            $found = $true
            break
        }
    }
    
    if (-not $found) {
        Write-Host "No se pudo encontrar la carpeta backend. Solo se creara el frontend." -ForegroundColor Yellow
    }
}

# Mostrar información de los archivos creados
Write-Host ""
Write-Host "Archivos de deployment creados:" -ForegroundColor Blue
Get-ChildItem "deployment" | Format-Table Name, Length, LastWriteTime

Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "1. Subir contenido de frontend.zip a public_html/ en Hostinger" -ForegroundColor White
Write-Host "2. Subir contenido de backend.zip a carpeta backend/ en Hostinger" -ForegroundColor White
Write-Host "3. Configurar Node.js en panel de Hostinger" -ForegroundColor White
Write-Host "4. Instalar dependencias: npm install" -ForegroundColor White
Write-Host "5. Configurar variables de entorno" -ForegroundColor White

Write-Host ""
Write-Host "Deployment preparado exitosamente!" -ForegroundColor Green