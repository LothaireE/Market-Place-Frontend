export type FilterUpdate = {
    category?: string | null;
    search?: string | null;
    sort?: string | null;
    page?: string | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    condition?: string | null;
};

export const applyNewSearchParams = (
    prev: URLSearchParams,
    newFilters: FilterUpdate,
) => {
    const updatedParams = new URLSearchParams(String(prev));

    const setOrDeleteParam = (
        key: string,
        value: string | null | undefined,
    ) => {
        if (value === undefined) return;
        if (value === null || value === "") updatedParams.delete(key);
        else updatedParams.set(key, value);
    };

    setOrDeleteParam("category", newFilters.category ?? undefined);
    setOrDeleteParam("search", newFilters.search ?? undefined);
    setOrDeleteParam("sort", newFilters.sort ?? undefined);
    setOrDeleteParam("minPrice", newFilters.minPrice?.toString() ?? undefined);
    setOrDeleteParam("maxPrice", newFilters.maxPrice?.toString() ?? undefined);
    setOrDeleteParam("condition", newFilters.condition ?? undefined);

    if (newFilters.page !== undefined) {
        // if (newFilters.page === null || newFilters.page === "1") {
        if (newFilters.page === null) {
            updatedParams.delete("page");
        } else {
            updatedParams.set("page", String(newFilters.page));
        }
    }

    return updatedParams;
};
