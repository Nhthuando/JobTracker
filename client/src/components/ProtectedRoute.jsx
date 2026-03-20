import { Navigate } from "react-router-dom";

function ProtectedRoute ({children}){
    const token = localStorage.getItem("token");
        const isInvalidToken =
            !token ||
            token === "undefined" ||
            token === "null" ||
            token.split(".").length !== 3;

        if (isInvalidToken) {
            localStorage.removeItem("token");
            return <Navigate to="/login" replace />;
        }
    else return children;
}

export default ProtectedRoute;