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
                // width: "100%",
                maxWidth: "10rem",
                display: "flex",
                alignItems: "center",
                padding: "8px 0 2px",
                borderBottom: "1px solid 'text.primary'",
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
