import {Claim} from "./Claim";
import {OpeningResult} from "./OpeningResult";

export interface CompanyApi {
    open(claim: Claim): Promise<OpeningResult>;
}