import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// import Avatar from "@mui/material/Avatar";
import CardActions from "@mui/material/CardActions";
import { Box, Divider, Typography } from "@mui/material";
import LinkButton from "../material-ui/MuiLink";

export type DashboardItemPropsType<T> = {
    item: T;
    extractDisplay: (item: T) => {
        id: string;
        name: string;
        sellerUsername: string;
        // status: string;
        // images: [string];
        // species?: string;
        // origin?: string;
    };
};

export function DashboardItem<T>({
    item,
    extractDisplay,
}: DashboardItemPropsType<T>) {
    // const { id, name, status, image, species, origin } = extractDisplay(item);
    const { id, name, sellerUsername } = extractDisplay(item);

    return (
        <Box
            sx={{
                minWidth: 275,
                bgcolor: "background.paper",
                boxShadow: 1,
            }}
        >
            <Card variant="outlined">
                <CardContent>
                    {/* <Typography
                        gutterBottom
                        sx={{ color: "text.secondary", fontSize: 14 }}
                    >
                        {status}
                    </Typography> */}
                    <Divider sx={{ mb: 2 }} />
                    {/* <Avatar
                        sx={{ width: 64, height: 64, marginY: 2 }}
                        alt={name}
                        src={imagesUrl[0]}
                    /> */}
                    <Typography variant="h5" component="div">
                        {name}
                    </Typography>
                    {/* <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                        {species}
                    </Typography> */}
                    <Typography variant="body2">
                        seller: {sellerUsername}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <LinkButton size="small" to={`/product-details/${id}`}>
                            Learn More about {name}
                        </LinkButton>
                    </Box>
                </CardActions>
            </Card>
        </Box>
    );
}
