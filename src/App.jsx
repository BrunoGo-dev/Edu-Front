import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

//import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/routes/Layout";
import DashboardPage from "@/routes/Dashboard/page";
import LoginPage from "@/routes/Login/page";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <LoginPage />,
        },
        {
            path: "/app",
            element: (
                // <ProtectedRoute>
                // </ProtectedRoute>
                <Layout />
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
