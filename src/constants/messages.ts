export const COMMON_MESSAGES = {
    REQUIRE_AUTH: "You must  be logged in to perfrom this action",
};

export const ABOUT_TEXTS = [
    {
        id: "about_1",
        content:
            "This marketplace frontend provides an interface for browsing, searching, and purchasing goods and services. It prioritizes usability and performance so customers can find what they need quickly on both desktop and mobile.",
    },
    {
        id: "about_2",
        content:
            "Built with React, TypeScript and Material UI, the application is modular and easy to extend. It communicates with backend APIs for listings, user accounts and orders, so the UI remains fast and responsive as data changes.",
    },
    {
        id: "about_3",
        content:
            "The backend is built with Node.js and GraphQL and is split into a mainServer and an authServer. Authentication uses JWTs so the authServer issues and validates tokens while the mainServer focuses on business logic and GraphQL resolvers for listings, users and orders.",
    },
    {
        id: "about_4",
        content:
            "Key features include secure authentication, product listings, shopping cart and checkout flows, order history and administrative tools. The app emphasizes accessibility, client-side validation and a straightforward developer experience for future enhancements.",
    },
];
