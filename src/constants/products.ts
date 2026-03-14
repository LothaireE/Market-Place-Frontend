import type { ProductCondition } from "../types/product.type";

export const CONDITIONS: ProductCondition[] = [
    "EXCELLENT",
    "GOOD",
    "CORRECT",
    "USED",
    "DAMAGED",
];

export const DEFAULT_PAGE_SIZE = 12;

export const CONDITION_FILTERS: { label: string; value: ProductCondition }[] = [
    { label: "Excellent", value: "EXCELLENT" },
    { label: "Good", value: "GOOD" },
    { label: "Correct", value: "CORRECT" },
    { label: "Used", value: "USED" },
    { label: "Damaged", value: "DAMAGED" },
];

export const SORT_OPTIONS = [
    { label: "Newest first", value: "NEWEST" },
    { label: "Price: low → high", value: "PRICE_ASC" },
    { label: "Price: high → low", value: "PRICE_DESC" },
];
