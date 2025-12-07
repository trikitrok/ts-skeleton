import {Customer} from "./Customer";

export class Claim {
    private readonly _policyNumber: string;
    private readonly _id: string;
    private readonly _claimDate: Date;
    private readonly _description: string;
    private readonly _customer: Customer;
    private readonly _causeCode: string;

    constructor(id: string, policyNumber: string, claimDate: Date, description: string, customer: Customer, causeCode: string) {
        this._policyNumber = policyNumber;
        this._id = id;
        this._claimDate = claimDate;
        this._description = description;
        this._customer = customer;
        this._causeCode = causeCode;
    }

    causeCode(): string {
        return this._causeCode;
    }

    id(): string {
        return this._id;
    }
}