import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ColorSelector from "../../components/forms/shared/ColorSelector";

describe("ColorSelector", () => {
    it("renders all color options", () => {
        render(<ColorSelector onSelectedColor={() => {}} selectedColor={null} />);
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBe(9);

        expect(screen.getByRole("button", { name: /White/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Black/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Blue/i })).toBeInTheDocument();
    });

    it("calls onSelectedColor when a color is clicked", () => {
        const onSelected = vi.fn();
        render(<ColorSelector onSelectedColor={onSelected} selectedColor={null} />);
        const redButton = screen.getByRole("button", { name: /Red/i });
        fireEvent.click(redButton);
        expect(onSelected).toHaveBeenCalledTimes(1);
        expect(onSelected).toHaveBeenCalledWith("Red");
    });

    it("calls onSelectedColor on Enter and Space keydown", () => {
        const onSelected = vi.fn();
        render(<ColorSelector onSelectedColor={onSelected} selectedColor={null} />);
        const greenButton = screen.getByRole("button", { name: /Green/i });

        fireEvent.keyDown(greenButton, { key: "Enter" });
        fireEvent.keyDown(greenButton, { key: " " });

        expect(onSelected).toHaveBeenCalledTimes(2);
        expect(onSelected).toHaveBeenCalledWith("Green");
    });

    it("renders the selected indicator (icon) for the selected color only", () => {
        render(<ColorSelector onSelectedColor={() => {}} selectedColor="Blue" />);

        const blueButton = screen.getByRole("button", { name: /Blue/i });
        const whiteButton = screen.getByRole("button", { name: /White/i });

        // the icon is rendered as an SVG inside the selected button
        const svgInBlue = blueButton.querySelector("svg");
        const svgInWhite = whiteButton.querySelector("svg");

        expect(svgInBlue).toBeTruthy();
        expect(svgInWhite).toBeNull();
    });

    it("does not call onSelectedColor when disabled", () => {
        const onSelected = vi.fn();
        render(
            <ColorSelector
                onSelectedColor={onSelected}
                selectedColor={null}
                disabled={true}
            />
        );

        const orangeButton = screen.getByRole("button", { name: /Orange/i });
        fireEvent.click(orangeButton);
        fireEvent.keyDown(orangeButton, { key: "Enter" });
        fireEvent.keyDown(orangeButton, { key: " " });

        expect(onSelected).not.toHaveBeenCalled();
    });
});