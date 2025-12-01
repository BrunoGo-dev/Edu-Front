import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/routes/Layout";
import InicioPage from "@/routes/Inicio/page";
import LoginPage from "@/routes/Login/page";
import AdminUsuarios from "@/routes/Admin/page";
import DocenteCalificaciones from "@/routes/Docente/page";
import EstudianteCalificaciones from "@/routes/Estudiante/page";
import DocenteAsistencia from "@/routes/Docente/Asistencia";
import EstudianteAsistencia from "@/routes/Estudiante/Asistencia";
import DocenteTareas from "@/routes/Docente/Tareas";
import EstudianteTareas from "@/routes/Estudiante/Tareas";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <LoginPage />,
        },
        {
            path: "/app",
            element: (
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "Inicio",
                    element: <InicioPage />,
                },
                {
                    path: "admin/usuarios",
                    element: (
                        <ProtectedRoute requiredRoles="ADMINISTRADOR">
                            <AdminUsuarios />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "docente/calificaciones",
                    element: (
                        <ProtectedRoute requiredRoles="DOCENTE">
                            <DocenteCalificaciones />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "estudiante/calificaciones",
                    element: (
                        <ProtectedRoute requiredRoles="ESTUDIANTE">
                            <EstudianteCalificaciones />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "docente/asistencia",
                    element: (
                        <ProtectedRoute requiredRoles="DOCENTE">
                            <DocenteAsistencia />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "estudiante/asistencia",
                    element: (
                        <ProtectedRoute requiredRoles="ESTUDIANTE">
                            <EstudianteAsistencia />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "docente/tareas",
                    element: (
                        <ProtectedRoute requiredRoles="DOCENTE">
                            <DocenteTareas />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "estudiante/tareas",
                    element: (
                        <ProtectedRoute requiredRoles="ESTUDIANTE">
                            <EstudianteTareas />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
