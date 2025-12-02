import { ApolloClient, InMemoryCache } from "@apollo/client";
import { API_URLS } from "../config/config";

export const client = new ApolloClient({
    uri: API_URLS.marketPlace,
    cache: new InMemoryCache(),
});
