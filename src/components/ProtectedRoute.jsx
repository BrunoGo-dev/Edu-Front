import { useAuth } from "@/contexts/auth-context";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();
    if (!user)
        return (
            <Navigate
                to="/"
                replace
            />
        );
    return children;
}
