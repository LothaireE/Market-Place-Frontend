import {
    Container,
    Typography,
    // Button,
    Divider,
    Box,
    Paper,
} from "@mui/material";
// import { useAppContext } from "../context/useAppContext";
import { useAuthContext } from "../context/useAppContext";
// import Dashboard from "../components/dashboard/Dashboard";
import { gql, useQuery } from "@apollo/client";
import DashboardGrid from "../components/dashboard/DashboardGrid";

const pagination = {
    page: null,
    pageSize: null,
    sortBy: null,
    sortDirection: null,
};

const GET_PRODUCTS = gql`
    # query Products($pagination: PaginationInput!, $filter: null) {
    # query Products($pagination: PaginationInput!, $filter: ProductFilterInput) {
    #     products(pagination: $pagination, filter: $filter) {
    query Products($pagination: PaginationInput!) {
        products(pagination: $pagination) {
            items {
                id
                name
                sellerProfile {
                    user {
                        #   id
                        username
                        email
                    }
                }
            }
            totalPages
            totalProducts
            currentPage
        }
    }
`;

type Product = {
    id: string;
    name: string;
    sellerProfile: {
        user: {
            username: string;
            email: string;
        };
    };
};

type ProductsQueryResponse = {
    products: {
        totalPages: number;
        totalProducts: number;
        currentPage: number;
        items: Product[];
    };
};

export default function Homepage() {
    // const { toggleTheme } = useAppContext();
    // const context = useAppContext();
    const context = useAuthContext();

    // const { toggleTheme } = context;
    const { loading, error, data } = useQuery<ProductsQueryResponse>(
        GET_PRODUCTS,
        { variables: { pagination: pagination } } //page } }
    );

    console.log("context homepage", context);

    return (
        <Container
            sx={{
                bgcolor: "background.paper",
                height: "100vh",
            }}
            className="App"
        >
            {/* <Button onClick={toggleTheme}>toggle theme</Button> */}
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
                        Welcome to our marketplace! Explore a wide range of
                        products and enjoy music together.
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {error && <>error component to add</>}
                    <DashboardGrid
                        loading={loading}
                        content={data?.products?.items ?? []}
                        extractDisplay={(item) => ({
                            id: item.id,
                            name: item.name,
                            sellerUsername: item.sellerProfile.user.username,
                        })}
                    />
                    <Divider sx={{ my: 2 }} />
                </Box>
            </Paper>
        </Container>
    );
}
