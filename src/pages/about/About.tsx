import React from "react";
import {
    Container,
    Box,
    Typography,
    Paper,
    Avatar,
    Stack,
    Divider,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ABOUT_TEXTS } from "../../constants/messages";

const About: React.FC = () => {
    return (
        <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 3,
                    background:
                        "linear-gradient(135deg, rgba(63,81,181,0.04), rgba(0,150,136,0.02))",
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                        <InfoOutlinedIcon fontSize="large" />
                    </Avatar>

                    <Box>
                        <Typography variant="h3" component="h1" sx={{ lineHeight: 1 }}>
                            About
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Learn more about this MVP Marketplace
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2}>
                    {ABOUT_TEXTS.map((text) => (
                        <Paper
                            key={text.id}
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: "background.paper",
                                // transition: "transform 150ms ease, box-shadow 150ms ease",
                                // "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                            }}
                        >
                            <Typography variant="body1" color="text.primary">
                                {text.content}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>
            </Paper>
        </Container>
    );
};

export default About;
