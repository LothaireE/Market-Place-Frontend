import { NumberField } from "@base-ui-components/react/number-field";

const PriceInput = ({
    price,
    handleSetPrice,
    isDisabled,
}: {
    price: number;
    handleSetPrice: (value: number) => void;
    isDisabled: boolean;
}) => {
    return (
        <NumberField.Root
            disabled={isDisabled}
            value={price}
            min={0}
            max={100000}
            step={1}
            onValueChange={(value) => value && handleSetPrice(value)}
            id="price-input"
            style={{
                maxWidth: "10rem",
                display: "flex",
                alignItems: "center",
                padding: "8px 0 2px",
                borderBottom: isDisabled
                    ? "2px solid #5C5C5C"
                    : "2px solid #2B4C7E",
            }}
        >
            <NumberField.Input
                style={{
                    width: "100%",
                    padding: 0,
                    margin: 0,
                    outline: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: "1rem",
                    background: "transparent",
                    color: "inherit",
                }}
            />
        </NumberField.Root>
    );
};

export default PriceInput;
