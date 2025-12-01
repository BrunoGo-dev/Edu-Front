# Edu-frontend

Plataforma educativa moderna para la gestión de asistencias, tareas y calificaciones.

## Características Principales

- **Autenticación y Autorización**: Sistema seguro de login con roles de usuario (Docente, Estudiante).
- **Gestión de Asistencias**: Registro y visualización de asistencias por curso.
- **Gestión de Tareas**:
  - **Docentes**: Creación de tareas, revisión de entregas y feedback.
  - **Estudiantes**: Visualización de tareas pendientes y subida de entregas.
- **Interfaz Moderna**: Diseño responsive y amigable utilizando TailwindCSS.

## Tecnologías

- **Frontend**: React, Vite
- **Estilos**: TailwindCSS
- **Estado y Rutas**: React Router DOM, Context API
- **Contenedorización**: Docker

## Requisitos Previos

- Node.js (v18+)
- npm o yarn

## Instalación

1.  Clonar el repositorio:
    ```bash
    git clone <url-del-repo>
    cd front-asistencias
    ```

2.  Instalar dependencias:
    ```bash
    npm install
    ```

## Configuración

Crear un archivo `.env` en la raíz del proyecto basándose en el siguiente ejemplo:

```ini
# URL de la API en desarrollo
VITE_API_URL_DEV=http://localhost:8080

```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Despliegue

### Docker

El proyecto incluye un `Dockerfile` optimizado para despliegue en Cloud Run (puerto 3000).

1.  Construir la imagen:
    ```bash
    docker build -t edu-frontend .
    ```

2.  Correr el contenedor:
    ```bash
    docker run -p 3000:3000 edu-frontend
    ```

### Google Cloud Run

La configuración está lista para desplegarse en Cloud Run, exponiendo el servicio en el puerto 3000.

## Estructura del Proyecto

- `src/routes`: Páginas y vistas principales.
- `src/layouts`: Componentes de estructura (Sidebar, Header).
- `src/contexts`: Manejo de estado global (Auth).
- `src/utils`: Utilidades y configuración de API.