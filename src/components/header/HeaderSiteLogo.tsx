import { useNavigate } from "react-router";
// import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Box, Typography } from "@mui/material";

const HeaderSiteLogo = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
            }}
            onClick={() => navigate("/")}
        >
            <Box>
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: ".15rem",
                        color: "inherit",
                        textDecoration: "none",
                    }}
                >
                    MUZICOS
                </Typography>
                <Typography
                    noWrap
                    sx={{ display: { xs: "none", sm: "block" } }}
                >
                    MUSIC MARKET
                </Typography>
            </Box>
        </Box>
    );
};

export default HeaderSiteLogo;
