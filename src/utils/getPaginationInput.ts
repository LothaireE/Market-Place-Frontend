import type { PaginationInput } from "../types/product.type";


export const getPaginationInput = (
    page: number,
    sort: string, // "DATE" | "PRICE_ASC" | "PRICE_DESC",
    pageSize: number,
    newSortBy: "DATE" | "PRICE" = "DATE",
    newSortDirection: "ASC" | "DESC" = "DESC"
): PaginationInput => {
   switch (sort) {
        case "PRICE_ASC":
            return {
                page,
                pageSize,
                sortBy: "PRICE",
                sortDirection: "ASC",
            };

        case "PRICE_DESC":
            return {
                page,
                pageSize,
                sortBy: "PRICE",
                sortDirection: "DESC",
            };

        default:
            return {
                page,
                pageSize,
                sortBy: newSortBy,
                sortDirection: newSortDirection,
            };
    }
};
