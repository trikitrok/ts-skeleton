import {AuthToken} from "./AuthToken";

export interface AuthTokenRetriever {
    retrieveToken(): Promise<AuthToken>;
}