import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import type {
    ProductCondition,
    ProductFilterInput,
} from "../types/product.type";
import {
    applyNewSearchParams,
    type FilterUpdate,
} from "../utils/applyNewSearchParams"
import { DEFAULT_PAGE_SIZE } from "../constants/products";
import {  getPaginationInput } from "../utils/getPaginationInput";

export const useProductListFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const category = searchParams.get("category") ?? null;
    const search = searchParams.get("search") ?? null;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const conditionParam = searchParams.get("condition") ?? null;
    const sortParam = searchParams.get("sort") ?? "NEWEST";
    const rawPage = Number(searchParams.get("page") ?? "1");
    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

    const selectedConditions = useMemo(
        () =>
            conditionParam
                ? (conditionParam.split(",") as ProductCondition[])
                : [],
        [conditionParam],
    );

    const filter = useMemo<ProductFilterInput>(
        () => ({
            search: search ?? undefined,
            category: category ?? undefined,
            minPrice: minPrice ? Number(minPrice) : null,
            maxPrice: maxPrice ? Number(maxPrice) : null,
            condition:
                selectedConditions.length > 0 ? selectedConditions : null,
        }),
        [search, category, minPrice, maxPrice, selectedConditions],
    );

    const pagination = useMemo(()=> getPaginationInput(page, sortParam, DEFAULT_PAGE_SIZE), [page, sortParam])

    const setFilterParams = useCallback(
        (filterUpdate: FilterUpdate) => {
            setSearchParams((prev) =>
                applyNewSearchParams(prev, filterUpdate),
            );
        },
        [setSearchParams],
    );

    return {
        searchParams,
        page,
        sort: sortParam,
        category,
        searchName: search,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        selectedConditions,
        filter,
        pagination,
        setFilterParams,
    };
};
