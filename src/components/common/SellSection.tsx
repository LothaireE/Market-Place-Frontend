import { Box, Container, Typography, Button, Grid, Stack } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useOnBoardNavigate from "../../hooks/onBoardNavigate";

export const StepLine = ({
    number,
    text,
}: {
    number: string;
    text: string;
}) => (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
            sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: (theme) => `2px solid ${theme.palette.primary.main}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
            }}
        >
            {number}
        </Box>
        <Typography variant="body2">{text}</Typography>
    </Stack>
);

const SellSection = () => {
    const onBoardNavigate = useOnBoardNavigate();

    const handleClick = () => {
        onBoardNavigate("seller/new");
    };

    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Your trash could be someone else's treasure.
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Sell your unused gear in just a few seconds: take a
                            picture, add a description, set your price and
                            that's it.
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddCircleOutlineIcon />}
                            sx={{ borderRadius: 999 }}
                            onClick={handleClick}
                        >
                            Sell a product
                        </Button>
                    </Grid>

                    <Grid>
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: (theme) =>
                                    `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                gutterBottom
                            >
                                How does it work?
                            </Typography>

                            <Stack spacing={1.5}>
                                <StepLine
                                    number="1"
                                    text="Take a few pictures of your item."
                                />
                                <StepLine
                                    number="2"
                                    text="Add a description and set your price (please, be reasonable)."
                                />
                                <StepLine
                                    number="3"
                                    text="Publish, sell, and ship from home."
                                />
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default SellSection;
