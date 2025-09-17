# 🌌 Educaverso | Backend

Una aplicación web moderna construida para [Beunik](https://beunik.co/), diseñada para ofrecer una experiencia rápida, escalable y amigable para el usuario. Este proyecto utiliza las mejores prácticas de desarrollo con Next y herramientas modernas para el frontend.

## 🖥️ Demo

🔗 [Ver Demo en vivo](https://tu-sitio-web.com)  

---

## 🧰 Tecnologías utilizadas

- **TypeScript** – Tipado estático para mayor robustez
- **Strapi** – Tipado estático para mayor robustez
- **PostgreSQL** - Base de datos relacional
- **Docker** - 
---

## ⚙️ Instalación

### 1. Clonar el repositorio Backend

```bash
git clone https://github.com/tu-usuario/mi-proyecto-next.git
cd educaverso-api
```

### 2. Instalar las dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar las variables de entorno

Crea un archivo .env.local en la raíz del proyecto con tus variables de entorno:

```bash
# Server
HOST=0.0.0.0
PORT=1337

# Secrets
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=

# Database
DATABASE_CLIENT=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_SSL=
DATABASE_FILENAME=
JWT_SECRET=

# Bunny
BUNNY_API_KEY=
BUNNY_STORAGE_ZONE=
BUNNY_PULL_ZONE=
```

### 4. Levantar la BD de PostgreSQL

```bash
docker compose up -d
```

### 5. Ejecutar la semilla de datos

```bash
npm run seed:educaverso
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
# o
yarn dev
```

### 7. Clonar y configurar el repositorio Frontend

🔗 [Educaverso | Frontend](https://github.com/tu-usuario/mi-proyecto-next.git)

---

## 🥷 Accesos de Prueba

```bash
andresg_94@correo.com       # Correo
Abcd1234                    # Contraseña
```

---

## 🧪 Scripts útiles

```bash
npm run seed:educaverso     # Iniciar el seed de datos falsos
npm run dev                 # Servidor de desarrollo
npm run build               # Compilación para producción
npm run start               # Iniciar en modo producción
npm run upgrade             # Actualizar strapi
```

---

## 👨‍💻 Autor
Desarrollado con ❤️ por **Cristian David**
🔗 [GitHub](https://tu-sitio-web.com) · [LinkedIn](https://tu-sitio-web.com)