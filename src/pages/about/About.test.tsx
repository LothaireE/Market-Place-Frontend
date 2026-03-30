import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ABOUT_TEXTS } from "../../constants/messages";
import About from "./About";

describe("About page", () => {
    // it("should have a heading", () => {
    //     render(<About />);
    //     // const heading = screen.getByRole("h1", { name: /about/i });
    //     const heading = screen.getByText(/about/i );
    //     expect(heading).toBeInTheDocument();
    // });

    it("should display the correct content", () => {
        render(<About />);
        ABOUT_TEXTS.forEach((text) => {
            const content = screen.getByText(text.content);
            expect(content).toBeInTheDocument();
        });
    });
});
