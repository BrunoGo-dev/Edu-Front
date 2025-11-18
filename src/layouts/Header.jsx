import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

import { ChevronsLeft, LogOut, Moon, Sun } from "lucide-react";

const Header = ({ collapsed, setCollapsed }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
            </div>

            {/* User Info */}
            {user && (
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.username || user.email}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => {
                        setTheme(theme === "light" ? "dark" : "light");
                    }}
                    title="Cambiar tema"
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
                <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                    title="Cerrar sesión"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;
