import { useRef, useEffect } from "react";

export function useDebouncedSearch<T>(
    value: string,
    delay: number,
    searchFn: (search: string) => Promise<T | void>
) {
    const lastValueRef = useRef<string>("");

    useEffect(() => {
        if (value === lastValueRef.current) return;

        const handler = setTimeout(() => {
            if (value.length > 2) {
                lastValueRef.current = value;
                searchFn(value);
            }
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay, searchFn]);
}
