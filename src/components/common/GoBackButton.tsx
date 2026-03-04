import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const GoBackButton = ({ textContent = "Back" }) => {
    const navigate = useNavigate();
    return (
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            {textContent}
        </Button>
    );
};

export default GoBackButton;
