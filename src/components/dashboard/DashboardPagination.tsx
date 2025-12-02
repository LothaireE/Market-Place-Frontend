import { Pagination } from "@mui/material";
import React from "react";

export type PaginationProps = {
    count: number;
    page: number;
    handlePageChange: (value: number) => number | void;
};
const DashboardPagination = ({
    count,
    page,
    handlePageChange,
}: PaginationProps) => {
    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        handlePageChange(value);
    };

    return (
        // <Grid size={8}>
        <Pagination
            count={count}
            page={page}
            onChange={(event, value) => handleChange(event, value)}
        />
        // </Grid>
    );
};

export default DashboardPagination;
