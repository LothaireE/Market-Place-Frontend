import { useNavigate } from "react-router";
import { useAuthContext, useSellerContext } from "../context/useAppContext";

type PathOptions = {
    authPath?: string;
    onboardingPath?: string;
    defaultPath?: string;
};

// TODO: change to useSellerProfile
const useOnBoardNavigate = (pathOptions: PathOptions = {}) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthContext();
    const { sellerProfile } = useSellerContext();

    const { authPath = "/authenticate", onboardingPath = "/onboarding" } =
        pathOptions;

    return (targetPath: string) => {
        if (!isAuthenticated) {
            navigate(authPath, { state: { redirectTo: targetPath } });
            return;
        }

        if (!sellerProfile) {
            navigate(onboardingPath, { state: { redirectTo: targetPath } });
            return;
        }

        navigate(targetPath);
    };
};

export default useOnBoardNavigate;
