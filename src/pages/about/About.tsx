import { Typography, Box } from "@mui/material";
import { ABOUT_TEXTS } from "../../constants/messages";

function About() {
    return (
        <Box>
            <Typography variant="h2">About</Typography>
            <Box
                mt={2}
                gap={{ xs: 2, md: 4 }}
                display="flex"
                flexDirection="column"
            >
                {ABOUT_TEXTS.map((text) => (
                    <Typography key={text.id} variant="body1">
                        {text.content}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
}

export default About;
