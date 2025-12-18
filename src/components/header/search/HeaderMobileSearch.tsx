import { styled } from "@mui/material/styles";
import { BaseSearchInput } from "./BaseSearchInput";

const Form = styled("form")(() => ({
    flexGrow: 1,
    display: "flex",
}));

type Props = {
    value: string;
    onChange: (value: string) => void;
    onSubmit?: (e: React.FormEvent) => void;
    placeholder?: string;
};

const HeaderMobileSearch = ({
    value,
    onChange,
    onSubmit,
    placeholder = "Find gear…",
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

export default HeaderMobileSearch;
