import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Navigate } from "react-router";
import Toast from "../common/Toast";
import { useAuthContext, useSellerContext } from "../../context/useAppContext";

const SellerRoute = ({ children }: { children: React.ReactNode }) => {
    const { authStatus } = useAuthContext();
    const { sellerProfile, loading: sellerLoading, error } = useSellerContext();
    const [openToast, setOpenToast] = useState(false);

    useEffect(() => {
        setOpenToast(Boolean(error));
    }, [error]);

    const toast = error ? (
        <Toast
            onOpen={openToast}
            onClose={() => setOpenToast(false)}
            message={String(error)}
            severity="error"
        />
    ) : null;

    if (authStatus === "loading" || sellerLoading)
        return (
            <>
                {toast}
                <CircularProgress size={20} sx={{ mr: 1 }} /> Connection...
            </>
        );

    if (authStatus === "unauthenticated")
        return (
            <>
                {toast} <Navigate to="/authenticate" replace />;
            </>
        );

    if (error)
        return (
            <>
                {toast} <Navigate to="/" replace />;
            </>
        );

    if (!sellerProfile)
        return (
            <>
                {toast}
                <Navigate to="/seller/onboarding" replace />;
            </>
        );
    // )
    // <Navigate to="/seller/onboarding" replace />;

    return (
        <>
            {toast}
            {children}
        </>
    );
};

export default SellerRoute;

// export const SellerRoute = ({
//     children,
// }: {
//     children: React.ReactNode;
// }) => {
//     const { authStatus } = useAuthContext();

//     if (authStatus === "loading")
//         return (
//             <>
//                 <CircularProgress size={20} sx={{ mr: 1 }} /> Connection...
//             </>
//         );

//     if (authStatus === "unauthenticated") {
//         return <Navigate to="/authenticate" replace />;
//     }
//     // if (!isAuthenticated) return <Navigate to="/authenticate" replace />;
//     // if (!user?.sellerProfile)
//     //     return <Navigate to="/seller/onboarding" replace />;

//     return children;
// };

// export default SellerRoute;
