import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const token =
        localStorage.getItem("access");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    if (
        !user ||
        user.role !== "SUB_ADMIN"
    ) {

        localStorage.clear();

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    return children;

}

export default ProtectedRoute;