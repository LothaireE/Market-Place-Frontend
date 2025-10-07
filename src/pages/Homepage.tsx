import {
    Container,
    Typography,
    Button,
    Divider,
    Box,
    Paper,
} from "@mui/material";
import { useAppContext } from "../context/useAppContext";

export default function Homepage() {
    const { toggleTheme } = useAppContext();

    return (
        <Container
            sx={{
                bgcolor: "background.paper",
                height: "100vh",
            }}
            className="App"
        >
            <Button onClick={toggleTheme}>toggle theme</Button>
            <Paper elevation={0}>
                <Typography
                    variant="h1"
                    sx={{
                        textAlign: "center",
                    }}
                >
                    Market Place App
                </Typography>
                <Box
                    sx={{
                        height: { md: 64, sm: 24 },
                        maxHeight: "xl",
                    }}
                />
                <Box
                    sx={{
                        justifyContent: "center",
                        gap: 1,
                        bgcolor: "background.default",
                    }}
                >
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Ratione, inventore dolorem nemo libero minus quis
                        eligendi saepe quam. Nisi quo porro soluta dolorum
                        eligendi! Facere vel reiciendis corrupti officiis saepe.
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Laboriosam fugit totam neque repellendus
                        voluptates? Odio, consequatur dolores. Nesciunt maxime
                        facilis, eius enim, alias similique deserunt
                        reprehenderit impedit rerum repudiandae ut.
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Deserunt iusto id eos, dolorem optio facilis
                        mollitia sequi necessitatibus tenetur error commodi ex
                        laborum atque, vel pariatur saepe ab reprehenderit hic.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}
