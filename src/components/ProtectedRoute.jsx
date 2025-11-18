import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRoles = null }) {
    const { hasRole, isAuthenticated } = useAuth();

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated()) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    // Si se requieren roles específicos y el usuario no los tiene
    if (requiredRoles && !hasRole(requiredRoles)) {
        return (
            <Navigate
                to="/app/Dashboard"
                replace
            />
        );
    }

    return children;
}
