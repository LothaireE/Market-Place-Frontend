import {
    // Box,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    Divider,
    // Accordion,
    // AccordionSummary,
    // AccordionDetails,
    ImageList,
    ImageListItem,
    Container,
    Button,
} from "@mui/material";
// import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useNavigate, useParams } from "react-router";
import { gql, useQuery } from "@apollo/client";
import { useApi } from "../hooks/useApi";
import { API_URLS } from "../config/config";
// import CustomPaginationActionsTable from "../components/EpisodeTable";
// import ListAccordionExpandIcon from "../components/Accordion";

export type ProductImage = {
    publicId: string;
    url: string;
    width: number;
    height: number;
    bytes: number;
    format: string;
    name: string;
};
export type ProductDetail = {
    id: string;
    name: string;
    condition: "EXCELLENT" | "GOOD" | "CORRECT" | "USED" | "DAMAGED";
    description: string;
    price: number;
    sellerProfile: {
        user: {
            username: string;
            email: string;
        };
    };
    images: [ProductImage];
};

export type ProductDetailQueryResponse = {
    product: ProductDetail;
};

const GET_PRODUCT_BY_ID = gql`
    query Product($id: ID!) {
        product(id: $id) {
            id
            name
            description
            price
            condition
            # imagesUrl
            sellerProfile {
                user {
                    username
                    # email
                }
            }
            images {
                publicId
                url
                width
                height
                bytes
                format
                name
            }
        }
    }
`;

function StandardImageList(productImages: ProductImage[]) {
    return (
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {productImages.map((item) => (
                <ImageListItem key={item.publicId}>
                    <img
                        srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                        alt={item.name}
                        loading="lazy"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}

function Details() {
    const { id } = useParams<{ id: string }>();
    const { loading, error, data } = useQuery<ProductDetailQueryResponse>(
        GET_PRODUCT_BY_ID,
        { variables: { id } }
    );
    const { fetchWithAuth } = useApi();
    const navigate = useNavigate();

    if (loading) return <CircularProgress />;
    if (error)
        return <Typography color="error">Cannot find character</Typography>;

    async function handleDeleteProduct() {
        try {
            const response = await fetchWithAuth(API_URLS.deleteProduct, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: data?.product.id,
                }),
            });

            if (!response.ok) {
                console.error("Delete request failed", response);
            } else {
                console.log("Product deleted", response);
            }
        } catch (err) {
            console.error("Delete error", err);
            // }
        } finally {
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
    }
    async function handleUpdateProduct() {
        navigate(`/update-product/${data?.product.id}`);
    }

    return (
        <Container sx={{ height: "100vh" }}>
            <Typography variant="h2">Details</Typography>
            <Button onClick={handleDeleteProduct}>
                delete {data?.product.name}
            </Button>
            <Button onClick={handleUpdateProduct}>
                update {data?.product.name}
            </Button>
            <Paper sx={{ height: "100%", p: 4, mb: 24 }}>
                <Typography variant="h4" gutterBottom>
                    {data?.product.name}
                </Typography>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        {data &&
                            data?.product?.images?.length > 0 &&
                            StandardImageList(data.product.images)}
                    </Grid>
                    <Grid>
                        <Typography variant="h6">Biography</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography>Name: {data?.product.name}</Typography>
                        <Typography>
                            Condition: {data?.product.condition}
                        </Typography>
                        <Typography>
                            Price: {data?.product.price} USD
                        </Typography>
                        <Typography>
                            Seller: {data?.product.sellerProfile.user.username}
                        </Typography>
                        {/* {data?.product?.episode && (
                            <CustomPaginationActionsTable
                                episode={data?.product.episode}
                            />
                        )} */}

                        {/* <Box mt={3}>
                            <Typography variant="h6">Episodes</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <Typography component="span">
                                            Appeared in{" "}
                                            {data?.product.episode.length}{" "}
                                            episodes
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
       
                                        {data?.product?.episode && (
                                            <CustomPaginationActionsTable
                                                episode={data?.product.episode}
                                            />
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </Box> */}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default Details;
