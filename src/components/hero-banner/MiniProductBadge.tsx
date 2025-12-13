import { Avatar, Box, Typography } from "@mui/material";

type MiniProductBadgeProps = {
    title: string;
    price: string;
    avatarBg?: string;
};

const MiniProductBadge = ({
    title,
    price,
    avatarBg,
}: MiniProductBadgeProps) => {
    return (
        <Box
            sx={{
                bgcolor: "rgba(0,0,0,0.6)",
                borderRadius: 999,
                px: 1.5,
                py: 0.5,
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Avatar
                sx={{
                    width: 24,
                    height: 24,
                    bgcolor: avatarBg || "grey.700",
                    fontSize: 12,
                }}
            >
                €
            </Avatar>
            <Typography variant="caption" noWrap>
                {title}
            </Typography>
            <Typography variant="caption" fontWeight={700}>
                {price}
            </Typography>
        </Box>
    );
};

export default MiniProductBadge;
