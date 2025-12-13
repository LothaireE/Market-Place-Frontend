import { gql } from "@apollo/client";

export type SellerProfileQueryResponse = {
    sellerProfile: {
        id: string;
        bio: string | null;
        createdAt: string;
        verified: "PENDING" | "VERIFIED" | "REJECTED";
        rating?: number;
        shopName?: string;
        updatedAt?: string;
    };
};

// export const GET_SELLER_PROFILE = gql`
//     query SellerProfile {
//         sellerProfile {
//             id
//             bio
//             createdAt
//             verified
//             rating
//             shopName
//             updatedAt
//         }
//     }
// `;

export const GET_SELLER_PROFILE = gql`
    query SellerProfile {
        sellerProfile {
            bio
            createdAt
            id
            payoutAccount
            products {
                name
            }
            rating
            shopName
            updatedAt
            user {
                email
                username
                id
            }
            userId
            verified
        }
    }
`;
