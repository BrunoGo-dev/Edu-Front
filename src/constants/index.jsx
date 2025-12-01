import { BookCheck, BookUser, Home, Users, GraduationCap, Clock, ClipboardList } from "lucide-react";

export const navbarLinks = [
    {
        title: "",
        links: [
            {
                label: "Inicio",
                icon: Home,
                path: "/app/Inicio",
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
            {
                label: "Tareas",
                icon: ClipboardList,
                path: "/app/docente/tareas",
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
            {
                label: "Tareas",
                icon: ClipboardList,
                path: "/app/estudiante/tareas",
            },
        ],
    },
];
