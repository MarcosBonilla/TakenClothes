# Script para preparar archivos para subida a Hostinger
# Crea archivos ZIP separados para frontend y backend

Write-Host "🚀 Preparando archivos para deployment en Hostinger..." -ForegroundColor Green

# Crear carpeta de deployment si no existe
if (!(Test-Path "deployment")) {
    New-Item -ItemType Directory -Name "deployment"
    Write-Host "✅ Carpeta deployment creada" -ForegroundColor Yellow
}

# Comprimir frontend (contenido de dist)
Write-Host "📦 Comprimiendo frontend..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Compress-Archive -Path "dist\*" -DestinationPath "deployment\frontend.zip" -Force
    Write-Host "✅ Frontend comprimido: deployment\frontend.zip" -ForegroundColor Green
} else {
    Write-Host "❌ Error: Carpeta dist no encontrada. Ejecuta 'npm run build' primero." -ForegroundColor Red
    exit 1
}

# Comprimir backend
Write-Host "📦 Comprimiendo backend..." -ForegroundColor Cyan
if (Test-Path "backend") {
    Compress-Archive -Path "backend\*" -DestinationPath "deployment\backend.zip" -Force
    Write-Host "✅ Backend comprimido: deployment\backend.zip" -ForegroundColor Green
} else {
    Write-Host "❌ Error: Carpeta backend no encontrada." -ForegroundColor Red
    exit 1
}

# Mostrar información de los archivos creados
Write-Host "`n📊 Archivos de deployment creados:" -ForegroundColor Blue
Get-ChildItem "deployment" | Format-Table Name, Length, LastWriteTime

Write-Host "`n🎯 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Subir contenido de frontend.zip a public_html/ en Hostinger" -ForegroundColor White
Write-Host "2. Subir contenido de backend.zip a carpeta backend/ en Hostinger" -ForegroundColor White
Write-Host "3. Configurar Node.js en panel de Hostinger" -ForegroundColor White
Write-Host "4. Instalar dependencias: npm install" -ForegroundColor White
Write-Host "5. Configurar variables de entorno" -ForegroundColor White

Write-Host "`n✅ Deployment preparado exitosamente!" -ForegroundColor Green