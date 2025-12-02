import { Grid, CircularProgress, Box } from "@mui/material";
import { DashboardItem } from "./Dashboarditem";

type DashboardGridProps<T> = {
    loading: boolean;
    content: T[];
    extractDisplay: (item: T) => {
        id: string;
        name: string;
        sellerUsername: string;
        // image: string;
        // status: string;
        // species?: string;
        // origin?: string;
        // link: string;
    };
};

function DashboardGrid<T>({
    loading,
    content,
    extractDisplay,
}: DashboardGridProps<T>) {
    return (
        <>
            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "50vh",
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={4} sx={{ px: 2 }}>
                    {content?.map((item) => (
                        <Grid
                            size={{ xs: 6, md: 4 }}
                            key={extractDisplay(item).id}
                        >
                            <DashboardItem
                                item={item}
                                extractDisplay={extractDisplay}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
}

export default DashboardGrid;
