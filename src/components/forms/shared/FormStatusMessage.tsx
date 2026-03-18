import { Typography } from "@mui/material";

type Props = {
    error?: string | null;
    info?: string | null;
};

const FormStatusMessage = ({ error, info }: Props) => {
    if (error) {
        return (
            <Typography color="error" variant="body2" alignSelf="center">
                {error}
            </Typography>
        );
    }

    if (info) {
        return (
            <Typography color="primary" variant="body2">
                {info}
            </Typography>
        );
    }

    return null;
};

export default FormStatusMessage;
