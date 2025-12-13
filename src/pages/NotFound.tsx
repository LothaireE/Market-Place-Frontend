import { Typography, Box, Button, Container } from "@mui/material";
import { Link } from "react-router";

function NotFound() {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                height: "100vh",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignSelf: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                    // height: "100vh"
                    maxWidth: "20rem",
                }}
            >
                <Typography sx={{ textAlign: "center", my: 2 }}>
                    The Page you are looking for does not exist...
                </Typography>
                <Typography sx={{ textAlign: "center" }}>
                    or may not have been implemented yet.
                    <br />
                    Apologies.
                    {/* <br />
                    L. */}
                </Typography>
                <Typography sx={{ textAlign: "end", my: 2, px: 10 }}>
                    L.
                </Typography>
                <Button
                    variant="contained"
                    sx={{ flex: 1, width: "fit-content", m: "0 auto" }}
                >
                    <Link to={"/"}>return to homepage</Link>
                </Button>
            </Box>
        </Container>
    );
}

export default NotFound;
