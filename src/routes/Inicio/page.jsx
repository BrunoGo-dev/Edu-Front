import { BookOpen, GraduationCap, Users, Calendar, CheckCircle, BarChart3 } from "lucide-react";

const InicioPage = () => {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-lg dark:from-blue-900 dark:to-indigo-900 lg:p-12">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Bienvenido a <span className="text-blue-200">Edutrack</span>
                    </h1>
                    <p className="mb-8 text-lg text-blue-100 lg:text-xl">
                        Sistema de Gestión Educativo integral para docentes y estudiantes. 
                        Simplifica tu vida académica con nuestras herramientas avanzadas.
                    </p>
                </div>
                
                {/* Decorative Background Elements */}
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute -bottom-12 right-12 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"></div>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <FeatureCard 
                    icon={BookOpen} 
                    title="Gestión de Cursos" 
                    description="Accede a todo el material de tus asignaturas en un solo lugar, organizado y siempre disponible."
                    color="blue"
                />
                <FeatureCard 
                    icon={CheckCircle} 
                    title="Control de Asistencia" 
                    description="Registra y monitorea la asistencia a clases de manera rápida y eficiente."
                    color="green"
                />
                <FeatureCard 
                    icon={GraduationCap} 
                    title="Calificaciones" 
                    description="Visualiza tu progreso académico y mantente al día con tus evaluaciones."
                    color="purple"
                />
                <FeatureCard 
                    icon={Calendar} 
                    title="Tareas y Entregas" 
                    description="Gestiona tus tareas pendientes, realiza entregas y recibe retroalimentación."
                    color="orange"
                />
                <FeatureCard 
                    icon={Users} 
                    title="Comunidad" 
                    description="Conecta con docentes y compañeros para un aprendizaje colaborativo."
                    color="pink"
                />
                <FeatureCard 
                    icon={BarChart3} 
                    title="Reportes" 
                    description="Genera reportes detallados sobre el rendimiento y la asistencia."
                    color="cyan"
                />
            </div>

            {/* Quick Stats or Info */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Novedades del Sistema</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Nueva interfaz de Tareas</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Hemos actualizado la vista de tareas para mejorar la experiencia de entrega y calificación.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Modo Oscuro Mejorado</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Disfruta de una experiencia visual más cómoda con nuestro tema oscuro optimizado.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, color }) => {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
        orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        pink: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
        cyan: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    };

    return (
        <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className={`mb-4 inline-flex rounded-lg p-3 ${colorClasses[color]}`}>
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    );
};

export default InicioPage;