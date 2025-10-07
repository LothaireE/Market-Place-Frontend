import { useState, useEffect } from "react";

export function useDebouncedSearch<T>(
    value: string,
    delay: number,
    searchFn: (search: string) => Promise<T | void>
) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (value.length > 2) {
                setDebouncedValue(value);
                searchFn(value);
            }
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay, searchFn]);

    return debouncedValue;
}
