import { useEffect } from "react";

export function useDebouncedRange(
    range: [number, number],
    delay: number,
    onDebouncedChange: (range: [number, number]) => void
) {
    useEffect(() => {
        const handler = setTimeout(() => {
            onDebouncedChange(range);
        }, delay);

        return () => clearTimeout(handler);
    }, [range, delay, onDebouncedChange]);
}
