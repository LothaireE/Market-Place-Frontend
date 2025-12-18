import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

const InputWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingBottom: 6,
    borderBottom: `1px solid ${theme.palette.background.default}88`,
    transition: "border-color 0.2s ease, border-width 0.2s ease",

    "& svg": {
        color: theme.palette.background.default,
        opacity: 0.7,
        transition: "opacity 0.2s ease, color 0.2s ease",
    },

    "&:hover svg": {
        opacity: 1,
        color: theme.palette.background.default,
    },

    "&:focus-within svg": {
        opacity: 1,
        color: theme.palette.background.default,
    },

    "&:hover": {
        borderBottom: `1px solid ${theme.palette.background.default}`,
    },

    "&:focus-within": {
        borderBottom: `2px solid ${theme.palette.background.default}`,
    },
}));

const Input = styled("input")(({ theme }) => ({
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    color: theme.palette.background.default,
    fontSize: 14,
    padding: 0,
    "::placeholder": {
        color: theme.palette.background.default,
        opacity: 0.5,
        transition: "opacity 0.2s ease",
    },
    "&:hover::placeholder": {
        opacity: 0.7,
    },
    "&:focus::placeholder": {
        opacity: 0.4,
    },
}));

type BaseSearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export const BaseSearchInput = ({
    value,
    onChange,
    placeholder,
}: BaseSearchInputProps) => {
    return (
        <InputWrapper>
            {/* <Icon /> */}
            <SearchIcon />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </InputWrapper>
    );
};
