# Script final para preparar deployment a Hostinger
# Excluye archivos que puedan estar en uso

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

# Comprimir backend (buscar en carpeta padre, excluyendo archivos bloqueados)
Write-Host "Comprimiendo backend..." -ForegroundColor Cyan
$backendPath = "..\backend"

if (Test-Path $backendPath) {
    # Crear carpeta temporal para backend sin archivos bloqueados
    $tempBackend = "temp_backend"
    if (Test-Path $tempBackend) {
        Remove-Item $tempBackend -Recurse -Force
    }
    
    # Copiar backend excluyendo archivos problemáticos
    robocopy $backendPath $tempBackend /E /XF "*.db" "*.log" ".env" "node_modules" > $null
    
    # Comprimir carpeta temporal
    if (Test-Path $tempBackend) {
        Compress-Archive -Path "$tempBackend\*" -DestinationPath "deployment\backend.zip" -Force
        Write-Host "Backend comprimido: deployment\backend.zip" -ForegroundColor Green
        
        # Limpiar carpeta temporal
        Remove-Item $tempBackend -Recurse -Force
    }
} else {
    Write-Host "No se encontro carpeta backend. Solo se creara frontend.zip" -ForegroundColor Yellow
}

# Mostrar información de los archivos creados
Write-Host ""
Write-Host "Archivos de deployment creados:" -ForegroundColor Blue
if (Test-Path "deployment") {
    Get-ChildItem "deployment" | Format-Table Name, @{Name="Tamaño (MB)"; Expression={[math]::Round($_.Length/1MB, 2)}}, LastWriteTime
}

# Crear archivo README para deployment
$readmeContent = @"
# Archivos de Deployment para Hostinger

## Frontend (frontend.zip)
- Contenido: Todo el build optimizado de React
- Destino: Extraer en public_html/ de Hostinger
- Tamaño: ~5MB

## Backend (backend.zip)
- Contenido: Aplicación Node.js completa (sin node_modules ni DB)
- Destino: Extraer en carpeta /backend/ de Hostinger
- Nota: Ejecutar 'npm install' después de subir

## Pasos siguientes:
1. Subir frontend.zip → extraer en public_html/
2. Subir backend.zip → extraer en /backend/
3. Panel Hostinger → Node.js Selector → Activar Node.js 18+
4. Terminal Hostinger: cd /backend && npm install
5. Configurar variables de entorno (.env)
6. Configurar dominio y SSL
7. Probar aplicación

Ver DEPLOYMENT_GUIDE.md para instrucciones detalladas.
"@

$readmeContent | Out-File -FilePath "deployment\README.txt" -Encoding UTF8

Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Subir frontend.zip a public_html/ en Hostinger" -ForegroundColor White
Write-Host "2. Subir backend.zip a carpeta backend/ en Hostinger" -ForegroundColor White
Write-Host "3. Activar Node.js en panel de Hostinger" -ForegroundColor White
Write-Host "4. Ejecutar: npm install en backend" -ForegroundColor White
Write-Host "5. Configurar variables de entorno" -ForegroundColor White

Write-Host ""
Write-Host "¡Archivos listos para deployment!" -ForegroundColor Green
Write-Host "Ver deployment\README.txt para instrucciones completas" -ForegroundColor Cyan