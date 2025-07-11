import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../store/auth";

const PrivateLayout = () => {
    const setUser = useAuth((s) => s.setUser);
    const authData = JSON.parse(localStorage.getItem("diraAuth") || "{}");
    const token = authData?.token;

    useEffect(() => {
        if (token) {
            setUser(authData);
        }
    }, [token, setUser]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateLayout;
