import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

const brightWhite = "#ffffffff";
const shadowWhite = "#ffffffe4";

// const InputWrapper = styled("div")(({ theme }) => ({
const InputWrapper = styled("div")({
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingBottom: 6,
    // borderBottom: `1px solid ${theme.palette.background.default}88`,
    borderBottom: `1px solid ${shadowWhite}`,
    transition: "border-color 0.2s ease, border-width 0.2s ease",

    "& svg": {
        // color: theme.palette.background.default,
        color: brightWhite,
        opacity: 0.7,
        transition: "opacity 0.2s ease, color 0.2s ease",
    },

    "&:hover svg": {
        opacity: 1,
        // color: theme.palette.background.default,
        color: brightWhite,
    },

    "&:focus-within svg": {
        opacity: 1,
        // color: theme.palette.background.default,
        color: brightWhite,
    },

    "&:hover": {
        // borderBottom: `1px solid ${theme.palette.background.default}`,
        borderBottom: `1px solid ${brightWhite}`,
    },

    "&:focus-within": {
        // borderBottom: `2px solid ${theme.palette.background.default}`,
        borderBottom: `1.5px solid ${brightWhite}`,
    },
});

// const Input = styled("input")(({ theme }) => ({
const Input = styled("input")({
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    // color: theme.palette.background.default,
    color: shadowWhite,
    fontSize: 14,
    padding: 0,
    "::placeholder": {
        // color: theme.palette.background.default,
        color: shadowWhite,
        opacity: 0.5,
        transition: "opacity 0.2s ease",
    },
    "&:hover::placeholder": {
        opacity: 0.7,
    },
    "&:focus::placeholder": {
        opacity: 0.4,
    },
});

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
                autoComplete="off"
            />
        </InputWrapper>
    );
};
