# Edu-frontend

Plantilla base importada desde `BrunoGo-dev/front-asistencias`. Contiene la estructura base de la app: login, layout, sidebar, contexto de auth y rutas protegidas. Está pensada para que desarrolles las páginas de contenido en `src/routes`.

Pasos para ejecutar localmente:

1. Instalar dependencias
   npm install
   # o
   yarn install

2. Ejecutar en modo desarrollo
   npm run dev
   # o
   yarn dev

Notas importantes:
- Revisa `package.json` y actualiza el nombre del proyecto si lo deseas.
- El código usa imports con alias `@/`. Asegúrate de que `vite.config.js` y `jsconfig.json`/`tsconfig.json` (si aplica) conserven el alias.
- Endpoints API apuntan a `http://localhost:8080` en varios servicios (auth, permisos, usuarios). Configura variables de entorno si tus APIs están en otra URL.
- Esta importación se hizo sin historial (copia limpia). Si quieres conservar commits, realiza un fork o histórico completo desde el repo origen.

Estructura principal:
- src/
  - routes/ (Login, Layout, páginas)
  - layouts/ (Header, SideBar)
  - contexts/ (auth-context)
  - components/ (ProtectedRoute)
  - constants/
- index.html
- tailwind.config.js