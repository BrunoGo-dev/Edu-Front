import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/routes/Layout";
import DashboardPage from "@/routes/Dashboard/page";
import LoginPage from "@/routes/Login/page";
import AdminUsuarios from "@/routes/Admin/page";
import DocenteCalificaciones from "@/routes/Docente/page";
import EstudianteCalificaciones from "@/routes/Estudiante/page";
import DocenteAsistencia from "@/routes/Docente/Asistencia";
import EstudianteAsistencia from "@/routes/Estudiante/Asistencia";

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
                    path: "Dashboard",
                    element: <DashboardPage />,
                },
                {
                    path: "Cursos",
                    element: <DashboardPage />,
                },
                {
                    path: "Docentes",
                    element: <DashboardPage />,
                },
                {
                    path: "Asistencias",
                    element: <DashboardPage />,
                },
                {
                    path: "Tareas",
                    element: <DashboardPage />,
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
