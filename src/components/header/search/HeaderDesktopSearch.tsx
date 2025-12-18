import { styled } from "@mui/material/styles";
import { BaseSearchInput } from "./BaseSearchInput";

const Form = styled("form")({
    flexGrow: 1,
    maxWidth: 380,
    border: "none",
});

type Props = {
    value: string;
    onChange: (value: string) => void;
    onSubmit?: (e: React.FormEvent) => void;
    placeholder?: string;
};

const HeaderDesktopSearch = ({
    value,
    onChange,
    onSubmit,
    placeholder = "",
}: Props) => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit?.(event);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <BaseSearchInput
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </Form>
    );
};

export default HeaderDesktopSearch;
