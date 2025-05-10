# Proyecto Rent-Auto

Este proyecto utiliza Docker para levantar todos los servicios necesarios de forma rápida y sencilla. A continuación se explican los pasos para construir y ejecutar el entorno de desarrollo.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/) (en versiones modernas de Docker ya viene incluido)

## Estructura del proyecto

```
project-root/
├── docker-compose.yml
├── frontend/
│   └── Rent-Auto/
│       ├── Dockerfile
│       ├── package.json
│       └── ...
└── README.md
```

## Cómo levantar el proyecto

### 1. Clonar el repositorio (si aún no lo has hecho)

```bash
git clone https://github.com/JosFer720/Rent-Auto
cd Rent-Auto
```

### 2. Construir y ejecutar los servicios con Docker Compose

En la raíz del proyecto, ejecuta:

```bash
docker compose up --build
```

Este comando construirá las imágenes y levantará los contenedores definidos en el archivo `docker-compose.yml`.

### 3. Acceder a la aplicación

Una vez que los contenedores estén corriendo, puedes acceder a la aplicación en tu navegador en:

```
http://localhost:4173
```

> Asegúrate de que el puerto `4173` no esté siendo usado por otro proceso.

### 4. Detener los servicios

Cuando termines de trabajar con el proyecto, puedes detener los contenedores con:

```bash
docker compose down
```

Esto apagará y eliminará los contenedores, pero conservará las imágenes construidas.

## Observaciones

- El proyecto se ejecuta completamente dentro de contenedores, por lo que no necesitas instalar dependencias de manera manual.
- Si haces cambios en el código fuente, es recomendable reconstruir los servicios con:

```bash
docker compose up --build
```