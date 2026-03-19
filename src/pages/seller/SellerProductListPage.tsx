import {
    Container,
    Grid,
    Paper,
    Stack,
    IconButton,
    Button,
    Chip,
    TextField,
    InputAdornment,
    Radio,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EuroIcon from "@mui/icons-material/Euro";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import { useApi } from "../../hooks/useApi";
import { API_URLS } from "../../config/env";
import type { Product } from "../../types/product.type";
import { GET_SELLER_PRODUCTS } from "../../library/graphql/queries/products";
import { useState } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export function DeleteProductModal({
    open,
    handleClose,
    product,
    handleDelete,
}: {
    open: boolean;
    handleClose: () => void;
    product: Product;
    handleDelete: (productId: string) => void;
}) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-delete-product-title"
            aria-describedby="modal-delete-product-description"
        >
            <Box sx={style}>
                <Typography
                    id="modal-delete-product-title"
                    variant="h6"
                    component="h2"
                >
                    Delete {product.name}
                </Typography>
                <Typography
                    id="modal-delete-product-description"
                    sx={{ mt: 2 }}
                >
                    You are about to permanently delete this product. This
                    action cannot be undone.
                </Typography>

                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                    }}
                >
                    <Button onClick={() => handleDelete(product.id)}>
                        Delete
                    </Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "active":
            return "success";
        case "reserved":
            return "warning";
        case "sold":
            return "default";
        default:
            return "default";
    }
};
type SortBy = "DATE" | "PRICE";

type SortDir = "ASC" | "DESC";

type DeleteModalType = {
    productId: string | null;
    productName: string | null;
};

const SellerProductListPage = () => {
    const navigate = useNavigate();
    const { fetchWithAuth } = useApi();
    const [sortDirection, setSortDirection] = useState<SortDir>("DESC");
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState<SortBy>("DATE");
    const [open, setOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<DeleteModalType>({
        productId: null,
        productName: null,
    });
    const handleOpen = () => setOpen(true);
    //TODO: add toast here when delete successful puis navigate

    // const handleClose = () => setOpen(false);

    const pagination = { sortBy, sortDirection };
    const {
        data,
        loading: queryLoading,
        error,
        refetch,
    } = useQuery(GET_SELLER_PRODUCTS, {
        variables: { pagination: pagination },
    });

    const handleDelete = async (productId: string | null) => {
        if (!productId) return;
        setLoading(true);
        try {
            const response = await fetchWithAuth(API_URLS.deleteProduct, {
                method: "POST",
                body: JSON.stringify({ productId }),
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                await refetch();
            }
            setTimeout(() => {
                navigate("/seller");
            }, 3000);
        } catch (err) {
            console.error("Failed to delete product", err);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const handleEdit = (id: string) => {
        navigate(`/seller/products/${id}/edit`);
    };

    const handleView = (id: string) => {
        // navigate(`/product-details/${id}`);
        navigate(`/seller/products/${id}`);
    };

    const handleNewProduct = () => {
        navigate("/seller/products/new");
    };

    const handleSortBy = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as SortBy;
        setSortBy(value);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    mb: 4,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" },
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Your listings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your sellings: edit, delete, or publish new
                        listings.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleNewProduct}
                    sx={{ borderRadius: 999 }}
                >
                    Sell some more
                </Button>
            </Box>

            {/* TODO: a functionning search bar */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Search your listings…"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>
            {/* Pagination : order by, direction and some more to come */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <FormControl component="fieldset" sx={{ minWidth: 220 }}>
                        <FormLabel
                            component="legend"
                            sx={{
                                mb: 1,
                                fontSize: "0.875rem",
                                color: "text.secondary",
                            }}
                        >
                            Sort by
                        </FormLabel>
                        <RadioGroup
                            row
                            name="sort-by"
                            value={sortBy}
                            onChange={handleSortBy}
                        >
                            <FormControlLabel
                                value="DATE"
                                control={<Radio size="small" />}
                                label="Date"
                            />
                            <FormControlLabel
                                value="PRICE"
                                control={<Radio size="small" />}
                                label="Price"
                            />
                        </RadioGroup>
                    </FormControl>

                    <FormControl component="fieldset" sx={{ minWidth: 220 }}>
                        <FormLabel
                            component="legend"
                            sx={{
                                mb: 1,
                                fontSize: "0.875rem",
                                color: "text.secondary",
                            }}
                        >
                            Order
                        </FormLabel>
                        <RadioGroup
                            row
                            name="sort-direction"
                            value={sortDirection}
                            onChange={(e) =>
                                setSortDirection(e.target.value as SortDir)
                            }
                        >
                            <FormControlLabel
                                value="DESC"
                                control={<Radio size="small" />}
                                label={
                                    sortBy === "DATE"
                                        ? "Newest"
                                        : "Most expensive"
                                }
                            />
                            <FormControlLabel
                                value="ASC"
                                control={<Radio size="small" />}
                                label={
                                    sortBy === "DATE"
                                        ? "Oldest"
                                        : "Least expensive"
                                }
                            />
                        </RadioGroup>
                    </FormControl>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            size="small"
                            // variant="outlined"
                            variant="contained"
                            onClick={() => {
                                setSortBy("DATE");
                                setSortDirection("DESC");
                            }}
                        >
                            Reset filters
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {queryLoading && <Typography>Loading…</Typography>}
            {error && (
                <Typography color="error">
                    Failed to load your listings.
                </Typography>
            )}

            {!queryLoading && data?.sellerProducts?.length === 0 && (
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        textAlign: "center",
                        border: (theme) =>
                            `1px dashed ${theme.palette.divider}`,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        You have no listings yet
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Start selling your musical gear today.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleNewProduct}
                    >
                        Sell your first item
                    </Button>
                </Paper>
            )}

            <Grid container spacing={3}>
                {data?.sellerProducts?.map((product: Product) => {
                    const thumbnail = product.images?.[0]?.url
                    return (
                    <Grid key={product.id} size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={1}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                display: "flex",
                                gap: 2,
                                alignItems: "flex-start",
                                "&:hover": {
                                    boxShadow: 4,
                                },
                            }}
                        >
                             {thumbnail? <Box
                                component="img"
                                src={thumbnail}
                                alt={product.name}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    objectFit: "contain",
                                }}
                            />:
                            <Box
                                sx={{
                                    width: 100,
                                    height: 100,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "text.secondary",
                                }}
                            >
                                <MusicNoteIcon sx={{ fontSize: 48 }} />
                            </Box>}

                            <Box
                                sx={{
                                    flexGrow: 1,
                                    flex: 4,
                                    overflow: "hidden",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    noWrap
                                >
                                    {product.name} {product.createdAt}
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ mb: 1 }}
                                >
                                    <Chip
                                        size="small"
                                        label={`${product.unitPrice} €`}
                                        icon={<EuroIcon />}
                                        color="primary"
                                        variant="outlined"
                                    />
                                    <Chip
                                        size="small"
                                        // label={product.status}
                                        label={"product.status to implement"}
                                        // color={getStatusColor(product.status)}
                                        color={getStatusColor("default")}
                                        sx={{ textTransform: "capitalize" }}
                                    />
                                </Stack>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <VisibilityIcon
                                        fontSize="small"
                                        color="action"
                                    />
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        0 views
                                        {/* {product.views} views TODO: implement view count */}
                                    </Typography>
                                </Stack>
                            </Box>

                            {/* Actions */}
                            <Stack
                                spacing={1}
                                alignItems="center"
                                sx={{ flex: 1 }}
                            >
                                <IconButton
                                    onClick={() => handleEdit(product.id)}
                                    sx={{ bgcolor: "action.hover" }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        handleOpen();
                                        setDeleteModal({
                                            productId: product.id,
                                            productName: product.name,
                                        });
                                    }}
                                    sx={{
                                        bgcolor: "action.hover",
                                        color: "error.main",
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>

                                <IconButton
                                    onClick={() => handleView(product.id)}
                                    sx={{ bgcolor: "action.hover" }}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                            </Stack>
                        </Paper>
                    </Grid>
                )})}
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-delete-product-title"
                    aria-describedby="modal-delete-product-description"
                >
                    <Box sx={style}>
                        <Typography
                            id="modal-delete-product-title"
                            variant="h6"
                            component="h2"
                            sx={{ textAlign: "center" }}
                        >
                            Delete {deleteModal.productName}
                        </Typography>
                        <Typography
                            id="modal-delete-product-description"
                            sx={{ mt: 2, textAlign: "center" }}
                        >
                            You are about to permanently delete this product.
                            <br />
                            This action cannot be undone.
                        </Typography>

                        <Box
                            sx={{
                                mt: 2,
                                display: "flex",
                                gap: 1,
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                disabled={loading}
                                onClick={() =>
                                    handleDelete(deleteModal.productId)
                                }
                                sx={{
                                    bgcolor: "common.main",
                                    "&:hover": { bgcolor: "error.main" },
                                }}
                            >
                                Delete
                            </Button>
                            <Button
                                onClick={() => {
                                    setOpen(false);
                                    setDeleteModal({
                                        productId: null,
                                        productName: null,
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Grid>
        </Container>
    );
};

export default SellerProductListPage;
