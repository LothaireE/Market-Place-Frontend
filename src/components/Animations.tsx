import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/material";

export default function Animations() {
    return (
        <Box sx={{ width: 300, alignSelf: "center" }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
        </Box>
    );
}
