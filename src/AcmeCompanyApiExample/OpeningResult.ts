import {Claim} from "./Claim";

export abstract class OpeningResult {
    static successful(referenceInCompany: string, claim: Claim): OpeningResult {
        return new SuccessfulOpening(referenceInCompany, claim);
    }

    static failed(claim: Claim, description: string): OpeningResult {
        return new FailedOpening(claim, description);
    }
}

export class FailedOpening implements OpeningResult {
    readonly claim: Claim;
    readonly description: string;

    constructor(claim: Claim, description: string) {
        this.claim = claim;
        this.description = description;
    }
}

class SuccessfulOpening implements OpeningResult {
    readonly referenceInCompany: string;
    readonly claim: Claim;

    constructor(referenceInCompany: string, claim: Claim) {
        this.referenceInCompany = referenceInCompany;
        this.claim = claim;
    }
}