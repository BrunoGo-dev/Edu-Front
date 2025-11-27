import { BookCheck, BookUser, Home, Users, GraduationCap, Clock } from "lucide-react";

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
        title: "Escuela",
        links: [
            {
                label: "Docentes",
                icon: BookUser,
                path: "/app/Dashboard",
            },
            {
                label: "Alumnos",
                icon: Users,
                path: "/app/Dashboard",
            },
        ],
    },
    {
        title: "Clases",
        links: [
            {
                label: "Cursos",
                icon: BookUser,
                path: "/app/Dashboard",
            },
        ],
    },
    {
        title: "Asistencias",
        links: [
            {
                label: "Asistencias",
                icon: BookCheck,
                path: "/app/Dashboard",
            },
        ],
    },
];

export const adminLinks = [
    {
        title: "Administración",
        links: [
            {
                label: "Gestión de Usuarios",
                icon: Users,
                path: "/app/admin/usuarios",
            },
        ],
    },
];

export const docenteLinks = [
    {
        title: "Docente",
        links: [
            {
                label: "Mis Calificaciones",
                icon: GraduationCap,
                path: "/app/docente/calificaciones",
            },
            {
                label: "Pasar Lista",
                icon: Clock,
                path: "/app/docente/asistencia",
            },
        ],
    },
];

export const estudianteLinks = [
    {
        title: "Estudiante",
        links: [
            {
                label: "Mis Calificaciones",
                icon: GraduationCap,
                path: "/app/estudiante/calificaciones",
            },
            {
                label: "Mi Asistencia",
                icon: Clock,
                path: "/app/estudiante/asistencia",
            },
        ],
    },
];
