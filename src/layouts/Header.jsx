import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/auth-context";

import { ChevronsLeft, LogOut, Moon, Sun } from "lucide-react";

const Header = ({ collapsed, setCollapsed }) => {
    const { logout } = useAuth();
    const { theme, setTheme } = useTheme();

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
            <div></div>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => {
                        setTheme(theme === "light" ? "dark" : "light");
                    }}
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
                    onClick={logout}
                    className="ml-auto rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                >
                    <LogOut />
                </button>
            </div>
        </header>
    );
};

export default Header;
