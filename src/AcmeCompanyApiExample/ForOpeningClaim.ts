import {Claim} from "./Claim";
import {Cause} from "./Cause";
import {AuthToken} from "./AuthToken";

export interface ForOpeningClaim {
    open(claim: Claim, cause: Cause, authToken: AuthToken): Promise<string>;
}