import { gql } from "@apollo/client";

export type UserProfileQueryResponse = {
    user: {
        avatarUrl: boolean | null;
        createdAt: string;
        email: string;
        id: string;
        updatedAt?: string;
        username: string;
    };
};

export const GET_USER_PROFILE = gql`
    query User {
        user {
            avatarUrl
            createdAt
            email
            id
            updatedAt
            username
        }
    }
`;
