import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Navigate } from "react-router";
import { useAuthContext } from "../../context/useAppContext";
import Toast from "../common/Toast";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { authStatus, error } = useAuthContext();
    const [openToast, setOpenToast] = useState(false);

    useEffect(() => {
        setOpenToast(Boolean(error));
    }, [error]);

    const toast = error ? (
        <Toast
            onOpen={openToast}
            onClose={() => setOpenToast(false)}
            message={error}
            severity="error"
        />
    ) : null;

    if (authStatus === "loading")
        return (
            <>
                {toast}
                <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
            </>
        );

    if (authStatus === "authenticated" && error) {
        return (
            <>
                {toast}
                <Navigate to="/" replace />
            </>
        );
    }

    return (
        <>
            {toast}
            {children}
        </>
    );
};

export default ProtectedRoute;

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//     const { authStatus } = useAuthContext();

//     if (authStatus === "loading")
//         return (
//             <>
//                 <CircularProgress size={20} sx={{ mr: 1 }} /> Connection...
//             </>
//         );
//     if (authStatus === "unauthenticated")
//         return <Navigate to="/authenticate" replace />;

//     return children;
// };

// export default ProtectedRoute;
