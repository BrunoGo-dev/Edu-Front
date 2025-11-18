import { createContext, useState } from "react";
import { loginRequest } from "@/utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");

        if (storedUser) {
            return {
                ...JSON.parse(storedUser),
                token: storedToken,
                role: storedRole,
            };
        }
        return null;
    });

    const login = async (username, password) => {
        try {
            const response = await loginRequest({ username, password });

            // La API devuelve { token, role, id }
            const userData = {
                id: response.id,
                username,
                token: response.token,
                role: response.role,
            };

            // Guardar en localStorage
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", response.token);
            localStorage.setItem("role", response.role);

            setUser(userData);
        } catch (error) {
            throw new Error(error.message || "Usuario o contraseña inválidos");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    };

    const hasRole = (requiredRoles) => {
        if (!user) return false;
        if (!Array.isArray(requiredRoles)) {
            requiredRoles = [requiredRoles];
        }
        return requiredRoles.includes(user.role);
    };

    const isAuthenticated = () => {
        return user !== null && user.token !== undefined;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                hasRole,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext };
