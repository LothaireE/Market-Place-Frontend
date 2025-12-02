import { useContext } from "react";
// import AppContext from "./appContext";
import AuthContext from "./authContext";

// export const useAppContext = () => {
//     const context = useContext(AppContext);
//     if (!context)
//         throw new Error(
//             "useAppContext must be used within an AppContextProvider"
//         );
//     return context;
// };

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error(
            "useAuthContext must be used within an AppContextProvider"
        );
    return context;
};
