import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductFormPreview from "../../components/forms/shared/ProductFormPreview";
import type { ProductCondition } from "../../types/product.type";

describe("ProductFormPreview", () => {
    it("renders the preview heading", () => {
        render(
            <ProductFormPreview
                productName="Test Item"
                size="120cm"
                color="Blue"
                condition={"USED" as ProductCondition}
                price={10}
            />,
        );
        expect(screen.getByText(/preview/i)).toBeInTheDocument();
    });

    it("displays product name in strong and other parts with bullets", () => {
        render(
            <ProductFormPreview
                productName="Nice Guitar"
                size="120cm"
                color="Red"
                condition={"USED" as ProductCondition}
                price={25}
            />,
        );

        expect(
            screen.getByText("Nice Guitar", { selector: "strong" }),
        ).toBeInTheDocument();

        expect(screen.getByText("120cm Red •")).toBeInTheDocument();
        expect(screen.getByText("Used •")).toBeInTheDocument();
        expect(screen.getByText("25 €")).toBeInTheDocument();

    });

    it("shows placeholder title and 'No price yet' when name is empty and price is 0", () => {
        render(
            <ProductFormPreview
                productName=" "
                size=""
                color={null}
                condition={"" as ProductCondition}
                price={0}
            />,
        );

        expect(
            screen.getByText("Your listing title", { selector: "strong" }),
        ).toBeInTheDocument();
        expect(screen.getByText("Condition not set •")).toBeInTheDocument();
        expect(screen.getByText("No price yet")).toBeInTheDocument();
    });

});
