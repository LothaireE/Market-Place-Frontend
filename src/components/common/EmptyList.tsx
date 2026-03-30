import {
    Typography,
    Paper,
    Button,
} from "@mui/material";


type EmptyListType = {
    header: string
    textContent: string
    buttonLabel: string
    handleClick: ()=> void
}
const EmptyList = ({
    header,
    textContent,
    buttonLabel,
    handleClick
} : EmptyListType) => {
    return (
 <Paper
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        textAlign: "center",
                        border: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {header}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        {textContent}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => handleClick()}
                        sx={{ borderRadius: 999 }}
                    >
                        {buttonLabel}
                    </Button>
                </Paper>
    );
};

export default EmptyList;