import {
    BookCheck,
    BookUser,
    Home,
    Users,
} from "lucide-react";

export const navbarLinks = [
    {
        title: "",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/app/Dashboard",
            },
        ],
    },
    {
        title: "Empleados",
        links: [
            {
                label: "Empleados",
                icon: BookUser,
                path: "/app/Empleados",
            },
            {
                label: "Nuevo Empleado",
                icon: Users,
                path: "/app/nuevoEmpleado",
            },
        ],
    },
    {
        title: "Asistencias",
        links: [
            {
                label: "Asistencias",
                icon: BookUser,
                path: "/app/Asistencias",
            },
        ],
    },
    {
        title: "Permisos",
        links: [
            {
                label: "Permisos",
                icon: BookCheck,
                path: "/app/Permisos",
            },
        ],
    },
];
