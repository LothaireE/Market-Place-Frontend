import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// import Button from '@mui/material/Button';

// import MenuIcon from '@mui/icons-material/Menu';
import LinkButton from "./material-ui/MuiLink";
import NavLinks from "./NavLinks";
import type { NavLinkType } from "../types/navigation.type";

const links: NavLinkType[] = [
    { id: "1", to: "/", label: "home" },
    { id: "2", to: "/dashboard", label: "dashboard" },
    { id: "3", to: "/about", label: "about" },
    // { id: "4", to: "/product-details/1", label: "details" },
];

export default function NavBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar
                    sx={{
                        // border: "solid 2px",
                        width: "100%",
                        maxWidth: "xl",
                        alignSelf: "center",
                    }}
                >
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        <LinkButton color="inherit" to={"/"}>
                            Market Place
                        </LinkButton>
                    </Typography>

                    <Box color="inherit">
                        <NavLinks links={links} />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
