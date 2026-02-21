import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};

export const AdminRoute = ({ children }) => {
    const { user } = useAuthStore();

    if (!user || !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};
