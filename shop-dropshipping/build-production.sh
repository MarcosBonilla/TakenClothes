#!/bin/bash
# Script para build de producción

echo "🚀 Creando build de producción..."

# Limpiar dist anterior
rm -rf dist

# Build del frontend
echo "📦 Building frontend..."
npm run build

# Copiar archivos del backend
echo "📁 Preparando backend..."
mkdir -p dist/server
cp -r ../backend/src dist/server/
cp ../backend/package*.json dist/server/

# Crear archivo de configuración para Hostinger
echo "⚙️ Creando configuración para Hostinger..."

# .htaccess para React Router (SPA)
cat > dist/.htaccess << 'EOF'
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^ index.html [L]
EOF

echo "✅ Build completado en la carpeta 'dist'"
echo ""
echo "📋 Pasos siguientes:"
echo "1. Reemplaza 'tudominio.com' en .env.production con tu dominio real"
echo "2. Sube el contenido de 'dist' al public_html de Hostinger"
echo "3. Sube el contenido de 'dist/server' a una carpeta separada en tu VPS"
echo "4. Configura las variables de entorno en el servidor"