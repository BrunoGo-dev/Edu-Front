import { forwardRef } from "react";
import { NavLink } from "react-router-dom";

import { navbarLinks } from "@/constants";

import { cn } from "@/utils/cn";

const SideBar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-100 flex h-full w-60 flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-800",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-60",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            <div className="flex gap-x-3 p-3">
                <img
                    src="https://static.vecteezy.com/system/resources/previews/007/468/567/non_2x/colorful-simple-flat-of-security-guard-icon-or-symbol-people-concept-illustration-vector.jpg"
                    alt="Logo"
                    className="size-10"
                />
                {!collapsed && <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">EduTrack</p>}
            </div>
            <div className="flex w-full flex-col gap-y-4 overflow-x-hidden overflow-y-auto p-3 [scrollbar-width:thin]">
                {navbarLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("sidebar-group", collapsed && "md:items-center")}
                    >
                        <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
                        {navbarLink.links.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                            >
                                <link.icon
                                    size={22}
                                    className="shrink-0"
                                />
                                {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                            </NavLink>
                        ))}
                    </nav>
                ))}
            </div>
        </aside>
    );
});

// SideBar.displayName = "SideBar";

export default SideBar;
