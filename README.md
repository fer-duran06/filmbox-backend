# FilmBox — Infraestructura

Configuración de Docker Compose para la arquitectura SOA de FilmBox.

## Servicios

| Servicio  | Tecnología        | Puerto | Descripción                      |
| --------- | ----------------- | ------ | -------------------------------- |
| frontend  | Next.js 14        | 3000   | Interfaz de usuario              |
| backend   | Next.js 14 (API)  | 3001   | Proxy/API + lógica de negocio    |
| db        | PostgreSQL 16     | 5432   | Persistencia (favoritos)         |

## Red

Todos los servicios se comunican a través de la red Docker `filmbox-network` (driver: bridge).

```
[Usuario] → [frontend :3000] → [backend :3001] → [TMDB API]
                                      ↕
                                [db :5432]
```

## Requisitos previos

- Docker y Docker Compose instalados
- API Key de TMDB ([obtener aquí](https://developer.themoviedb.org/docs/getting-started))

## Inicio rápido

```bash
# 1. Clonar los 3 repositorios en el mismo directorio
git clone https://github.com/fer-duran06/filmbox-frontend.git
git clone https://github.com/fer-duran06/filmbox-backend.git
git clone https://github.com/fer-duran06/filmbox-infra.git

# 2. Configurar variables de entorno
cd filmbox-infra
cp .env.example .env
# Editar .env con tu TMDB_API_KEY y contraseña de PostgreSQL

# 3. Levantar todos los servicios
docker compose up --build

# 4. Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001/api/health
```

## Variables de entorno

Ver `.env.example` para la lista completa de variables requeridas.

> **Importante:** Nunca subas el archivo `.env` al repositorio. Solo `.env.example` debe estar versionado.

## Estructura del proyecto


filmbox-infra/
├── docker-compose.yml   # Orquestación de servicios
├── init.sql             # Script de inicialización de la BD
├── .env.example         # Template de variables de entorno
├── .gitignore
└── README.md
