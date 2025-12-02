import { Box } from "@mui/material";
import type { NavLinkType } from "../types/navigation.type";
import LinkButton from "./material-ui/MuiLink";

export type NavLinksProps = {
    links: NavLinkType[];
};

const NavLinks = ({ links }: NavLinksProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
            {links.map((link: NavLinkType) => (
                <LinkButton color="inherit" to={link.to} key={link.id}>
                    {link.label}
                </LinkButton>
            ))}
        </Box>
    );
};

export default NavLinks;
