# Script para build de producción en Windows

Write-Host "🚀 Creando build de producción..." -ForegroundColor Green

# Limpiar dist anterior
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Build del frontend
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
npm run build

# Crear .htaccess para React Router
Write-Host "⚙️ Creando configuración para Hostinger..." -ForegroundColor Yellow

$htaccess = @"
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^ index.html [L]
"@

Set-Content -Path "dist\.htaccess" -Value $htaccess

Write-Host "✅ Build completado en la carpeta 'dist'" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Pasos siguientes:" -ForegroundColor Cyan
Write-Host "1. Reemplaza 'tudominio.com' en .env.production con tu dominio real"
Write-Host "2. Sube el contenido de 'dist' al public_html de Hostinger"
Write-Host "3. Configura el backend Node.js en el VPS de Hostinger"
Write-Host "4. Configura las variables de entorno en el servidor"