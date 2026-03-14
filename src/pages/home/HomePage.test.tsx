import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "./HomePage";
import { MemoryRouter, Routes, Route } from "react-router";
import { MockedProvider } from "@apollo/client/testing";
import { GET_PRODUCTS } from "../../library/graphql/queries/products";
import type { Product } from "../../types/product.type";

const mockPagination = {
    page: 1,
    pageSize: 10,
    sortBy: "DATE",
    sortDirection: "DESC",
};
const mocks = [
    {
        request: {
            query: GET_PRODUCTS,
            variables: { pagination: mockPagination },
        },
        result: {
            data: {
                products: {
                    totalPages: 1,
                    totalProducts: 1,
                    currentPage: 1,
                    items: [
                        {
                            id: "58273b00-a086-42ac-83ab-13cc92d47b42",
                            name: "Nouveau Product",
                            sellerProfile: {
                                user: {
                                    username: "vendeur",
                                },
                            },
                            images: [
                                {
                                    publicId:
                                        "Nouveau_Product_20acb6d8744f981d/iizym7pcm08yiyxjbt2g",
                                    url: "https://res.cloudinary.com/dtidanadb/image/upload/v1769852122/Nouveau_Product_20acb6d8744f981d/iizym7pcm08yiyxjbt2g.jpg",
                                    width: 1000,
                                    height: 1000,
                                    bytes: 27826,
                                    format: "jpg",
                                    name: "Nouveau_Product_image_1",
                                },
                                {
                                    publicId:
                                        "Nouveau_Product_20acb6d8744f981d/lozysa7tdtmm4b5c0dm7",
                                    url: "https://res.cloudinary.com/dtidanadb/image/upload/v1769852122/Nouveau_Product_20acb6d8744f981d/lozysa7tdtmm4b5c0dm7.jpg",
                                    width: 600,
                                    height: 600,
                                    bytes: 37498,
                                    format: "jpg",
                                    name: "Nouveau_Product_image_2",
                                },
                            ],
                            status: "AVAILABLE",
                        } as Product,
                    ],
                },
            },
        },
    },
];

export function renderWithProviders(
    ui: React.ReactElement,
    { route = "/" } = {},
) {
    window.history.pushState({}, "Test page", route);

    return render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter initialEntries={[route]}>
                <Routes>
                    <Route path="*" element={ui} />
                </Routes>
            </MemoryRouter>
        </MockedProvider>,
    );
}

describe("HomePage", () => {
    it("should render without crashing", () => {
        renderWithProviders(<HomePage />);
    });

    it("should display the hero banner", async () => {
        renderWithProviders(<HomePage />);

        expect(await screen.findByText(/Sell your gear/i)).toBeInTheDocument();
        expect(
            await screen.findByText(/give your wallet a boost/i),
        ).toBeInTheDocument();
        expect(
            await screen.findByText(
                /Buy and sell used instruments and music gear easily and securely./i,
            ),
        ).toBeInTheDocument();

        expect(
            await screen.findByRole("link", { name: /browse gear/i }),
        ).toBeInTheDocument();

        expect(await screen.findByText(/Secure payments/i)).toBeInTheDocument();
        expect(
            await screen.findByText(/Buyer protection/i),
        ).toBeInTheDocument();
        expect(
            await screen.findByText(/Wide selection of instruments and gear/i),
        ).toBeInTheDocument();
        // });

        // expect(await screen.findByText(/latest finds/i)).toBeInTheDocument();
    });
});
