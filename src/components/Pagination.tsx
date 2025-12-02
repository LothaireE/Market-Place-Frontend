import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export type PaginationProps = {
    totalPages: number;
    pages: number;
};

export default function BasicPagination(paginationProps: PaginationProps) {
    return (
        <Stack spacing={2}>
            <Pagination
                count={paginationProps.totalPages}
                page={paginationProps.pages}
            />
        </Stack>
    );
}
