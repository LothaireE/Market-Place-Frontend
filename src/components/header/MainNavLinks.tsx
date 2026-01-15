import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";

export type MainNavLinkItem = {
    label: string;
    to: string;
    icon: React.ReactNode;
};

export const MAIN_NAV_LINKS = [
    {
        label: "Browse gear",
        to: "/products",
        icon: <HomeIcon fontSize="small" />,
    },
    { label: "About", to: "/about", icon: <InfoIcon fontSize="small" /> },
];
