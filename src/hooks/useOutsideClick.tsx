import { useState, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideClick<T extends HTMLElement>(
    ref: React.RefObject<T | null>
) {
    const [isInsideClick, setIsInsideClick] = useState<
        "inside" | "outside" | null
    >(null);

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        if (!ref.current) return;
        function handleClickOutside(event: MouseEvent) {
            if (ref.current?.contains(event.target as Node)) {
                setIsInsideClick("inside");
            } else {
                setIsInsideClick("outside");
            }
        }
        // Bind the event listener
        document.addEventListener("pointerdown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, [ref]);

    return isInsideClick;
}
