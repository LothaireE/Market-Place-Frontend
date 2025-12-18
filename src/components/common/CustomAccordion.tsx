import { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";

type AccordionProps = {
    children: React.ReactNode;
    open?: boolean;
};

const CustomAccordion: React.FC<AccordionProps> = ({
    children,
    open: openProp,
}) => {
    const open = openProp;

    const [maxHeight, setMaxHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;
        if (open) {
            setMaxHeight(contentRef.current.scrollHeight);
        } else {
            setMaxHeight(0);
        }
    }, [open, children]);

    return (
        <Box
            sx={{
                borderBottom: open ? "1px solid rgba(0,0,0,0.08)" : "none",
                borderLeft: open ? "1px solid rgba(0,0,0,0.08)" : "none",
                borderRight: open ? "1px solid rgba(0,0,0,0.08)" : "none",
                borderRadius: "0 0 18px 18px ",

                marginBottom: 12,
                background: "#fff",
                overflow: "hidden",
            }}
        >
            <Box
                aria-expanded={open}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                }}
            ></Box>
            <Box
                style={{
                    maxHeight: `${maxHeight}px`,
                    overflow: "hidden",
                    transition: "max-height 0.22s ease",
                }}
            >
                <Box ref={contentRef} style={{ padding: "12px 14px" }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default CustomAccordion;
