# 🚗 Proyecto Rent-Auto

**Rent-Auto** es una aplicación web para la gestión de alquiler de vehículos. Utiliza Docker para levantar automáticamente los servicios necesarios: frontend, backend y base de datos.

---

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/) (ya viene incluido en versiones modernas de Docker)

---

## 📁 Estructura del Proyecto

```
Rent-Auto/
├── docker-compose.yml
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── database/
│   │   ├── 01_ddl.sql
│   │   ├── 02_data.sql
│   │   └── dockerfile
│   └── dockerfile
│
├── frontend/
│   └── Rent-Auto/
│       ├── Dockerfile
│       ├── index.html
│       ├── nginx.conf
│       ├── package.json
│       ├── vite.config.js
│       └── src/
│
├── Proyecto#3*.pdf
└── README.md
```

---

## 🚀 Cómo Levantar el Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/JosFer720/Rent-Auto
cd Rent-Auto
```

### 2. Construir y ejecutar los servicios

```bash
docker compose up --build
```

Esto construirá y levantará automáticamente los siguientes servicios:

- 🧠 **Backend** (Python): http://localhost:3001  
- 🌐 **Frontend** (Vite + Nginx): http://localhost:4173  
- 🗄️ **Base de Datos** (PostgreSQL): puerto `5432` (expuesto para conexión local si es necesario)

### 3. Detener los servicios

```bash
docker compose down
```

---

## 🌐 Acceso a la Aplicación

Una vez que los contenedores estén activos:

- Frontend: [http://localhost:4173](http://localhost:4173)
- Backend (API REST): [http://localhost:3001](http://localhost:3001)

> Asegúrate de que los puertos `4173`, `3001` y `5432` no estén siendo usados por otros procesos.

---

## 📦 Base de Datos

- El contenedor de PostgreSQL ejecuta los scripts SQL automáticamente:
  - `01_ddl.sql`: crea las tablas.
  - `02_data.sql`: inserta datos iniciales.
- Las credenciales y el nombre de la base de datos están definidos en `docker-compose.yml`.

---

## 🔄 Desarrollo

No necesitas instalar manualmente dependencias. Si realizas cambios en el código fuente:

```bash
docker compose up --build
```

Esto reconstruirá los servicios con los cambios aplicados.

---

## 📄 Documentación

El repositorio incluye reportes y documentación técnica:

Archivos con reflexiones individuales
- `Proyecto#3 BD Erick Guerra - 23208.pdf`
- `Proyecto#3 BD Fernando Ruíz - 23065.pdf`
- `Proyecto#3FabianMorales.pdf`

Esta archivo es el diagrama de entidad relación ER
- `Proyecto3 Fabian Morales.pdf`
