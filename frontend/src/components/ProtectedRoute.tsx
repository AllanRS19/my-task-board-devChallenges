import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';

export function ProtectedRoute() {
    const { data, isLoading, isError } = useCurrentUser();

    if (isLoading) return <div>Loading...</div>;
    if (isError || !data) return <Navigate to="/auth" replace />;

    return <Outlet />;
}