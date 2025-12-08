# Archivos de Deployment para Hostinger

## Frontend (frontend.zip)
- Contenido: Todo el build optimizado de React
- Destino: Extraer en public_html/ de Hostinger
- TamaÃ±o: ~5MB

## Backend (backend.zip)
- Contenido: AplicaciÃ³n Node.js completa (sin node_modules ni DB)
- Destino: Extraer en carpeta /backend/ de Hostinger
- Nota: Ejecutar 'npm install' despuÃ©s de subir

## Pasos siguientes:
1. Subir frontend.zip â†’ extraer en public_html/
2. Subir backend.zip â†’ extraer en /backend/
3. Panel Hostinger â†’ Node.js Selector â†’ Activar Node.js 18+
4. Terminal Hostinger: cd /backend && npm install
5. Configurar variables de entorno (.env)
6. Configurar dominio y SSL
7. Probar aplicaciÃ³n

Ver DEPLOYMENT_GUIDE.md para instrucciones detalladas.
