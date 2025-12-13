import { Chip } from "@mui/material";

type InfoChipProps = {
    label: string;
};

const InfoChip = ({ label }: InfoChipProps) => (
    <Chip
        label={label}
        //  sx={{mt: "none"}}
        size="small"
        sx={{
            // mt: 0,
            borderRadius: 999,
            bgcolor: "background.paper",
            border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
    />
);

export default InfoChip;
