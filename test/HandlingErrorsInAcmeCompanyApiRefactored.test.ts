import {when} from 'jest-when';
import {Customer} from "../src/AcmeCompanyApiExample/Customer";
import {CannotGetCausesError} from "../src/AcmeCompanyApiExample/CannotGetCausesError";
import {CannotRetrieveTokenError} from "../src/AcmeCompanyApiExample/CannotRetrieveTokenError";
import {CannotOpenClaimError} from "../src/AcmeCompanyApiExample/CannotOpenClaimError";
import {Claim} from "../src/AcmeCompanyApiExample/Claim";
import {FailedOpening, OpeningResult} from "../src/AcmeCompanyApiExample/OpeningResult";
import {CannotFindMatchingCauseError} from "../src/AcmeCompanyApiExample/CannotFindMatchingCauseError";
import {CompanyApi} from "../src/AcmeCompanyApiExample/CompanyApi";
import {AuthTokenRetriever} from "../src/AcmeCompanyApiExample/AuthTokenRetriever";
import {Cause} from "../src/AcmeCompanyApiExample/Cause";
import {ForGettingCauses} from "../src/AcmeCompanyApiExample/ForGettingCauses";
import {ForOpeningClaim} from "../src/AcmeCompanyApiExample/ForOpeningClaim";


class WithErrorHandlingCompanyApi implements CompanyApi {
    constructor(private readonly decoratedApi: CompanyApi) {
    }

    async open(claim: Claim): Promise<OpeningResult> {
        try {
            return await this.decoratedApi.open(claim);
        } catch (e) {
            if (e instanceof CannotRetrieveTokenError) {
                return OpeningResult.failed(claim, 'Acme API: failure retrieving token');
            }
            if (e instanceof CannotGetCausesError) {
                return OpeningResult.failed(claim, 'Acme API: failure getting claim causes');
            }
            if (e instanceof CannotOpenClaimError) {
                return OpeningResult.failed(
                    claim, `Acme API: cannot open claim ${claim.id()}`
                );
            }
            if (e instanceof CannotFindMatchingCauseError) {
                return OpeningResult.failed(
                    claim, `Acme API: cannot find cause for claim ${claim.id()}`
                );
            }
            return OpeningResult.failed(
                claim, `Acme API: ${e.message}`
            );
        }
    }
}


class AcmeCompanyApiFactory {
    static create(
        forGettingCauses: ForGettingCauses,
        forOpeningClaim: ForOpeningClaim,
        authTokenRetriever: AuthTokenRetriever
    ): CompanyApi {
        return new WithErrorHandlingCompanyApi(
            new AcmeCompanyApi(forGettingCauses, forOpeningClaim, authTokenRetriever)
        );
    }
}

class AcmeCompanyApi implements CompanyApi {
    constructor(
        private readonly forGettingCauses: ForGettingCauses,
        private readonly forOpeningClaim: ForOpeningClaim,
        private readonly authTokenRetriever: AuthTokenRetriever) {
    }

    async open(claim: Claim): Promise<OpeningResult> {
        const token = await this.authTokenRetriever.retrieveToken();
        const causes = await this.forGettingCauses.getAllFor(claim, token);
        const cause = this.findCauseInClaim(causes, claim);
        const referenceInCompany = await this.forOpeningClaim.open(claim, cause, token);
        return OpeningResult.successful(referenceInCompany, claim);
    }

    private findCauseInClaim(causes: Cause[], claim: Claim): Cause {
        let foundCause = causes.find((c) => c.causeCode === claim.causeCode());
        if (!foundCause) {
            throw new CannotFindMatchingCauseError();
        }
        return foundCause;
    }
}

describe('AcmeCompanyApi', () => {
    let decoratedApi: jest.Mocked<CompanyApi>;
    let api: CompanyApi;
    let claim: Claim;

    let causeCodeInClaim = "lalala";

    beforeEach(() => {
        decoratedApi = {
            open: jest.fn<Promise<OpeningResult>, [Claim]>()
        };

        api = new WithErrorHandlingCompanyApi(decoratedApi);
        claim = aClaim(causeCodeInClaim);
    });

    it('should fail when token retrieval throws error', async () => {
        when(decoratedApi.open)
            .calledWith(claim)
            .mockImplementation((_) => {
                throw new CannotRetrieveTokenError('Cannot retrieve token')
            });

        const result = await api.open(claim);

        expect(result).toEqual(new FailedOpening(
            claim,
            'Acme API: failure retrieving token'
        ));
    });

    it('should fail when getting causes throws error', async () => {
        when(decoratedApi.open)
            .calledWith(claim)
            .mockImplementation((_) => {
                throw new CannotGetCausesError('Cannot retrieve causes')
            });

        const result = await api.open(claim);

        expect(result).toEqual(new FailedOpening(
            claim,
            'Acme API: failure getting claim causes'
        ));
    });

    it('should fail when finding matching cause throws error', async () => {
        when(decoratedApi.open)
            .calledWith(claim)
            .mockImplementation((_) => {
                throw new CannotFindMatchingCauseError()
            });

        const result = await api.open(claim);

        expect(result).toEqual(new FailedOpening(
            claim,
            'Acme API: cannot find cause for claim 123456789'
        ));
    });

    it('should fail when opening claim throws error', async () => {
        when(decoratedApi.open)
            .calledWith(claim)
            .mockImplementation((_) => {
                throw new CannotOpenClaimError('Cannot open claim')
            });

        const result = await api.open(claim);

        expect(result).toEqual(new FailedOpening(
            claim,
            'Acme API: cannot open claim 123456789'
        ));
    });

    it('should fail when an unknown error occurs', async () => {
        const unknownError = new Error('Unexpected error');
        when(decoratedApi.open)
            .calledWith(claim)
            .mockImplementation((_) => {
                throw unknownError;
            });

        const result = await api.open(claim);

        expect(result).toEqual(new FailedOpening(
            claim,
            'Acme API: Unexpected error'
        ));
    });

    function aClaim(causeCode: string): Claim {
        return new Claim(
            '123456789',
            '123456789',
            new Date('2021-01-01'),
            'Test claim',
            new Customer('Pepe', '+34668522001'),
            causeCode
        );
    }
});