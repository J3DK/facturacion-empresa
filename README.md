# Factura Pro - Professional Invoicing System

**Factura Pro** es un sistema completo de facturación, gestión de gastos y administración de clientes diseñado para pequeñas y medianas empresas. Construido con Next.js 14, MySQL, Prisma y NextAuth.

## 🎯 Características Principales

### 💼 Gestión Completa
- ✅ **Dashboard de Ingresos/Gastos** - Visualiza tus métricas financieras en tiempo real
- ✅ **Generador de Facturas** - Crea facturas profesionales con cálculo automático de IVA y retenciones
- ✅ **Gestión de Clientes** - Registro completo de clientes con RFC y razón social
- ✅ **Catálogo de Productos** - Gestiona productos con precios y categorías
- ✅ **Seguimiento de Gastos** - Registra y categoriza todos tus gastos

### 🔐 Seguridad
- ✅ **Autenticación con NextAuth.js** - Email/contraseña y Google OAuth
- ✅ **Base de Datos MySQL** - Gestión via phpMyAdmin
- ✅ **Contraseñas Hasheadas** - bcryptjs con 10 rondas
- ✅ **Sesiones JWT** - Tokens seguros y expiración configurable

### 🏗️ Infraestructura
- ✅ **Next.js 14 (App Router)** - Framework React moderno
- ✅ **Prisma ORM** - Querys type-safe
- ✅ **MySQL Database** - Compatible con phpMyAdmin
- ✅ **PM2 Ready** - Configuración standalone para hosting
- ✅ **Tailwind CSS** - Diseño responsive y profesional

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- MySQL 5.7+ o MariaDB
- npm o yarn

### 1. Instalación

```bash
# Clonar o descargar el proyecto
cd factura_ok

# Instalar dependencias
npm install

# O si usas yarn
yarn install
```

### 2. Configurar Base de Datos

```bash
# Crear base de datos MySQL
# Por phpMyAdmin o línea de comandos:
CREATE DATABASE factura_pro;
CREATE USER 'factura_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON factura_pro.* TO 'factura_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Variables de Entorno

```bash
# Copiar archivo ejemplo
cp .env.example .env.local

# Editar .env.local con tus datos:
nano .env.local
```

**Variables requeridas:**
```env
DATABASE_URL="mysql://factura_user:secure_password@localhost:3306/factura_pro"
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Migraciones de Base de Datos

```bash
# Crear tablas y esquema
npx prisma migrate dev --name init

# O si ya existe el esquema:
npx prisma db push

# Abrir Prisma Studio (UI para ver datos)
npx prisma studio
```

### 5. Iniciar Desarrollo

```bash
npm run dev
```

**Acceder a:** http://localhost:3000

---

## 📊 Estructura de Base de Datos

### Tablas Principales

| Tabla | Descripción |
|-------|------------|
| `users` | Usuarios del sistema |
| `accounts` | Cuentas OAuth (Google) |
| `sessions` | Sesiones activas |
| `clientes` | Clientes de usuario |
| `productos` | Productos/servicios |
| `facturas` | Facturas generadas |
| `items_factura` | Líneas de factura |
| `gastos` | Registro de gastos |
| `configuracion` | Configuración por usuario |

---

## 🔌 API REST Endpoints

### Autenticación
```
POST   /api/auth/register              Registrar usuario
POST   /api/auth/[...nextauth]         NextAuth endpoints
```

### Facturas
```
GET    /api/facturas                   Obtener todas las facturas
POST   /api/facturas                   Crear nueva factura
```

### Clientes
```
GET    /api/clientes                   Obtener clientes
POST   /api/clientes                   Crear cliente
```

### Productos
```
GET    /api/productos                  Obtener productos
POST   /api/productos                  Crear producto
```

### Gastos
```
GET    /api/gastos                     Obtener gastos
POST   /api/gastos                     Registrar gasto
```

### Perfil
```
GET    /api/users/profile              Obtener perfil usuario
```

---

## 🔧 Configuración para PM2

### 1. Crear archivo de configuración

```bash
cp ecosystem.config.example.js ecosystem.config.js
```

### 2. Editar según tu hosting

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "factura-pro",
      script: ".next/standalone/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000, // Cambiar según tu hosting
      },
      error_file: "logs/error.log",
      out_file: "logs/out.log",
    },
  ],
};
```

### 3. Build para Producción

```bash
npm run build
```

### 4. Iniciar con PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Monitoreo

```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs factura-pro

# Reiniciar
pm2 restart factura-pro

# Detener
pm2 stop factura-pro
```

---

## 📋 Cálculos Automáticos

### IVA (Impuesto al Valor Agregado)
- **Porcentaje configurable** (por defecto: 16%)
- Calculado automáticamente en cada factura

### Retenciones
- **Porcentaje configurable** (por defecto: 10%)
- Se aplica según configuración

### Ejemplo de Factura
```
Subtotal:        $100.00
IVA (16%):       $ 16.00
Retención (10%): $ 10.00
               ----------
Total Final:     $106.00
```

---

## 🎨 Personalización

### Cambiar Colores
Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: "#tu-color",
      secondary: "#otro-color",
    },
  },
},
```

### Cambiar Porcentajes (IVA, Retenciones)
En `prisma/schema.prisma`:

```prisma
model Configuracion {
  porcentajeIva       Float @default(16.0)
  porcentajeRetencion Float @default(10.0)
}
```

### Agregar Nuevas Categorías de Gasto
En `components/ExpenseTracker.tsx`:

```typescript
const categorias = [
  "Servicios",
  "Suministros",
  "Salarios",
  "Tu Categoría", // Agregar aquí
];
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev                  # Servidor desarrollo
npm run build               # Build producción
npm start                   # Servir build

# Base de datos
npm run prisma:generate    # Generar cliente Prisma
npm run prisma:migrate     # Ejecutar migraciones
npm run prisma:studio      # Abrir Prisma Studio

# Linting
npm run lint               # Ejecutar ESLint
```

---

## 📱 Páginas Disponibles

- `/` - Página de inicio
- `/auth/login` - Login
- `/auth/register` - Registro
- `/dashboard` - Dashboard principal
- `/dashboard/invoices` - Generador de facturas
- `/dashboard/expenses` - Seguimiento de gastos
- `/dashboard/clients` - Gestión de clientes
- `/dashboard/products` - Gestión de productos
- `/dashboard/settings` - Configuración

---

## 🔒 Consideraciones de Seguridad

### En Desarrollo
- `NEXTAUTH_SECRET`: Genera con `openssl rand -base64 32`
- `DATABASE_URL`: No commitear `.env.local`
- `JWT_SECRET`: Cambiar antes de producción

### En Producción (Hosting)
1. **HTTPS obligatorio** - Usar certificado SSL
2. **Cambiar secrets** - Nuevos valores para producción
3. **Backup BD** - phpMyAdmin o MySQL dump
4. **Monitoreo** - PM2 logs y alertas
5. **Firewall** - Restringir acceso MySQL

### Backup MySQL

```bash
# Backup manual
mysqldump -u factura_user -p factura_pro > backup_factura.sql

# Restaurar
mysql -u factura_user -p factura_pro < backup_factura.sql

# Backup automático (cron)
0 2 * * * mysqldump -u factura_user -p factura_pro > /backup/factura_$(date +\%Y\%m\%d).sql
```

---

## 🐛 Troubleshooting

### Error: "ECONNREFUSED" en MySQL
```bash
# Verificar conexión MySQL
mysql -u factura_user -p -h localhost

# Verificar DATABASE_URL en .env.local
echo $DATABASE_URL
```

### Error: "Can't find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Prisma Client outdated
```bash
npx prisma generate
```

### PM2 no inicia
```bash
# Ver logs detallados
pm2 logs factura-pro --lines 100

# Verificar que .next/standalone existe
npm run build
```

---

## 📞 Support & Documentación

- **Prisma Docs**: https://www.prisma.io/docs/
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth Docs**: https://next-auth.js.org/
- **TailwindCSS**: https://tailwindcss.com/

---

## 📝 Stack Técnico

| Componente | Versión | Propósito |
|-----------|---------|----------|
| Next.js | 14.2.28 | Framework React |
| React | 18.2.0 | UI Library |
| Prisma | 6.7.0 | ORM |
| MySQL | 5.7+ | Database |
| NextAuth | 4.24.11 | Authentication |
| TailwindCSS | 3.3.3 | CSS Framework |
| TypeScript | 5.2.2 | Type Safety |
| PM2 | Latest | Process Manager |

---

## 🎓 Próximos Pasos

1. ✅ Instalar y configurar localmente
2. ✅ Ajustar porcentajes (IVA, retenciones)
3. ✅ Agregar logo empresarial
4. ✅ Configurar SMTP para emails
5. ✅ Desplegar en hosting con PM2
6. ✅ Configurar backup automático

---

## 📄 Licencia

Uso privado y comercial permitido.

---

**¡Factura Pro - Simplicidad en la Facturación!** 💼

---

*Última actualización: 2024*
