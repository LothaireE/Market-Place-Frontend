import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { API_URLS } from "../../config/env";

const httpLink = new HttpLink({ uri: API_URLS.marketPlace });

export const AUTH_ACCESS_TOKEN = "mp_user_access_token";

if (process.env.NODE_ENV !== "production") {
    loadDevMessages();
    loadErrorMessages();
}

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(AUTH_ACCESS_TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// export const graphqlClient = new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache(),
// });

export const graphqlClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    me: { merge: false },
                    sellerProfile: { merge: false },
                },
            },
        },
    }),
});
