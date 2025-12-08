# Guía de Implementación en Hostinger

## 📦 Build de Producción Completada

✅ **Build exitosa creada en `/dist`**
- Tamaño total optimizado
- Archivos minificados y comprimidos
- Variables de entorno configuradas

## 🚀 Pasos para Subir a Hostinger

### 1. Preparación de Archivos

#### Frontend (Carpeta `dist/`)
```
dist/
├── index.html           # Página principal
├── assets/
│   ├── index-DVS3aPcS.js    # JavaScript minificado (224KB)
│   └── index-DZmEGmsK.css   # CSS minificado (30KB)
├── products/            # Imágenes de productos
├── logo.png            # Logo de la tienda
└── otros archivos estáticos
```

#### Backend (Carpeta `backend/`)
```
backend/
├── package.json         # Dependencias Node.js
├── src/
│   ├── app.js          # Servidor principal
│   ├── db.js           # Base de datos SQLite
│   ├── orders.js       # API de órdenes
│   ├── mercadopago.js  # Integración MercadoPago
│   └── paypal.js       # Integración PayPal
└── productos.db        # Base de datos SQLite
```

### 2. Configuración en Hostinger

#### A. Subir Frontend
1. **Acceder al File Manager** de Hostinger
2. **Navegar a `public_html/`**
3. **Subir todo el contenido de `dist/`** (no la carpeta, solo el contenido)
4. **Estructura final en public_html:**
   ```
   public_html/
   ├── index.html
   ├── assets/
   ├── products/
   ├── logo.png
   └── demás archivos...
   ```

#### B. Subir Backend
1. **Crear carpeta `backend/`** en el directorio raíz (fuera de public_html)
2. **Subir toda la carpeta backend:**
   ```
   /
   ├── public_html/ (frontend)
   └── backend/ (Node.js app)
   ```

### 3. Variables de Entorno en Hostinger

#### A. Configurar Variables de Entorno
En el panel de Hostinger, crear archivo `.env` en la carpeta `backend/`:

```env
# Configuración de Producción
NODE_ENV=production
PORT=3000

# URL del frontend
FRONTEND_URL=https://tudominio.com

# PayPal (usar tus credenciales reales)
PAYPAL_CLIENT_ID=tu_paypal_client_id_real
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret_real
PAYPAL_BASE_URL=https://api-m.paypal.com

# MercadoPago (cuando tengas las credenciales)
MERCADOPAGO_CLIENT_ID=tu_mercadopago_client_id
MERCADOPAGO_CLIENT_SECRET=tu_mercadopago_client_secret
MERCADOPAGO_ACCESS_TOKEN=tu_mercadopago_access_token

# Base de datos
DB_PATH=./productos.db
```

#### B. Configurar Variables del Frontend
El frontend ya está configurado para usar la variable de entorno de producción:
- `VITE_API_URL=https://tudominio.com/api`

### 4. Configuración de Node.js en Hostinger

#### A. Activar Node.js
1. **Panel de Control** → **Advanced** → **Node.js Selector**
2. **Seleccionar versión Node.js 18+**
3. **Configurar App Root:** `/backend`
4. **Configurar Startup File:** `src/app.js`

#### B. Instalar Dependencias
En el terminal de Hostinger o File Manager:
```bash
cd /backend
npm install
```

### 5. Configuración del Servidor Web

#### A. Configurar .htaccess (en public_html)
Crear archivo `.htaccess` para manejar rutas SPA:

```apache
RewriteEngine On
RewriteBase /

# Handle API requests - redirect to Node.js backend
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]

# Handle Angular/React Router - return index.html for non-file requests
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
```

### 6. Verificación Post-Implementación

#### ✅ Checklist de Verificación

1. **Frontend Funcionando:**
   - [ ] Sitio web carga correctamente
   - [ ] Imágenes se muestran bien
   - [ ] Navegación funciona
   - [ ] Carrito de compras opera

2. **Backend Funcionando:**
   - [ ] API responde en `/api/orders`
   - [ ] Base de datos se crea/conecta
   - [ ] CORS configurado correctamente

3. **Pagos Funcionando:**
   - [ ] PayPal procesa pagos de prueba
   - [ ] Órdenes se guardan en BD
   - [ ] Admin panel muestra órdenes

4. **URLs de Prueba:**
   - Frontend: `https://tudominio.com`
   - API: `https://tudominio.com/api/orders`
   - Admin: `https://tudominio.com/admin`

### 7. Configuración Final de MercadoPago

**Cuando tengas las credenciales reales de MercadoPago:**

1. **Actualizar variables de entorno** en Hostinger
2. **Habilitar botón de MercadoPago** en `Cart.tsx`:
   ```jsx
   // Cambiar de hidden a visible
   <option value="mercadopago">MercadoPago</option>
   ```
3. **Activar botón real** en `Checkout.tsx`:
   ```jsx
   // Cambiar simulación por integración real
   ```

### 8. Monitoreo y Mantenimiento

#### A. Logs y Debugging
- **Logs del servidor:** Revisar en Hostinger panel
- **Errores JavaScript:** Console del navegador
- **Base de datos:** Verificar `productos.db`

#### B. Copias de Seguridad
- **Backup automático** de base de datos
- **Versioning** del código en Git
- **Backup manual** antes de cambios importantes

## 🔧 Comandos Útiles para Producción

### Crear nueva build:
```powershell
# En el directorio del proyecto
.\build-production.ps1
```

### Verificar build local:
```powershell
# Servir build localmente para testing
npx serve dist
```

### Restart del backend en Hostinger:
```bash
# En terminal de Hostinger
cd /backend
npm restart
```

## 📞 Soporte

- **Hostinger Support:** Para temas de hosting y configuración
- **Documentación:** README.md del proyecto
- **Logs:** Revisar siempre logs ante problemas

---

**Estado Actual:** ✅ Build de producción lista para deploy
**Próximo Paso:** Subir archivos a Hostinger y configurar Node.js