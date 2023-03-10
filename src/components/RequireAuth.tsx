import useUserInfo, {UserRole} from "../hooks/useUserInfo";
import {Navigate, Outlet, useLocation} from "react-router-dom";

interface RequireAuthProps {
    allowedRoles: UserRole;
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
    const location = useLocation();
    const { user, isLoading } = useUserInfo();

    if (isLoading)
        return null;

    return (
        // If the user is undefined there is no auth_token so redirect to login
        !user
            ? <Navigate to="/login" state={{ from: location }} replace/>
            : (user.roles & allowedRoles) === allowedRoles // If there is a valid user, check they have the required role(s)
                ? <Outlet/>
                : <Navigate to="/" state={{ from: location }} replace/> // Navigate to home if not authorized
    );
};

export default RequireAuth;