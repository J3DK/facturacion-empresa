⚡ FACTURA PRO - QUICK START

## 5 Minutos a Funcionamiento

### 1️⃣ Instalar
```bash
npm install
```

### 2️⃣ Crear BD MySQL
```bash
# Vía phpMyAdmin o terminal:
CREATE DATABASE factura_pro;
CREATE USER 'factura_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON factura_pro.* TO 'factura_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3️⃣ Configurar .env
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
DATABASE_URL="mysql://factura_user:password123@localhost:3306/factura_pro"
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 4️⃣ Migraciones
```bash
npx prisma migrate dev --name init
```

### 5️⃣ Ejecutar
```bash
npm run dev
```

**Abre:** http://localhost:3000

---

## 📋 Usuarios de Prueba

**Email:** test@example.com  
**Contraseña:** Test1234!

---

## 🔧 Comandos Importantes

```bash
npm run dev              # Dev mode
npm run build           # Build producción
npx prisma studio      # Ver BD gráficamente
pm2 start ecosystem.config.js  # Producción
```

---

## 🚀 Despliegue (Hosting)

### 1. Build
```bash
npm run build
```

### 2. PM2
```bash
cp ecosystem.config.example.js ecosystem.config.js
# Editar puerto y settings
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. Verificar
```bash
pm2 status
pm2 logs factura-pro
```

---

## 📚 Documentación Completa

Ver `README.md` para detalles completos sobre:
- Endpoints API
- Configuración de BD
- Personalización
- Seguridad
- Troubleshooting

---

**¡Listo para usar! 🎉**
