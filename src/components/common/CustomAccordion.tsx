import React, { useRef, useState, useEffect } from "react";

type AccordionProps = {
    title?: string;
    isDisabled?: boolean;
    children: React.ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

const CustomAccordion: React.FC<AccordionProps> = ({
    title,
    isDisabled,
    children,
    defaultOpen = false,
    open: openProp,
    onOpenChange,
}) => {
    const isControlled = openProp !== undefined;
    const [openInternal, setOpenInternal] = useState(defaultOpen);
    const open = isControlled ? openProp! : openInternal;

    const [maxHeight, setMaxHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        if (open) {
            const scrollHeight = contentRef.current.scrollHeight;
            setMaxHeight(scrollHeight);
        } else {
            setMaxHeight(0);
        }
    }, [open, children]);

    const handleToggle = () => {
        const next = !open;

        if (!isControlled) {
            setOpenInternal(next);
        }

        onOpenChange?.(next);
    };

    return (
        <div
            style={{
                // border: "1px solid #ddd",
                borderRadius: 8,
                marginBottom: 8,
                overflow: "hidden",
            }}
        >
            <button
                type="button"
                disabled={isDisabled}
                onClick={handleToggle}
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    // background: "#f7f7f7",
                    border: "none",
                    cursor: isDisabled ? "default" : "pointer",
                    fontSize: "1rem",
                    textAlign: "left",
                }}
            >
                {/* {title && <span>{title}</span>} */}
                <span>{title}</span>
                {/* <span
                    style={{
                        transition: "transform 0.2s",
                        transform: open ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                >
                    ▸
                </span> */}
            </button>

            <div
                style={{
                    maxHeight: `${maxHeight}px`,
                    overflow: "hidden",
                    transition: "max-height 0.25s ease-in-out",
                }}
            >
                <div ref={contentRef} style={{ padding: "0.75rem 1rem" }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomAccordion;
