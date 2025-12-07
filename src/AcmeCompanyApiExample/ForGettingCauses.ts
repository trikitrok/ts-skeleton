import {Claim} from "./Claim";
import {AuthToken} from "./AuthToken";
import {Cause} from "./Cause";

export interface ForGettingCauses {
    getAllFor(claim: Claim, authToken: AuthToken): Promise<Cause[]>;
}