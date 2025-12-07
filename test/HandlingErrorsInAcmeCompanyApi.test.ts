import {when} from 'jest-when';
import {AuthToken} from "../src/AcmeCompanyApiExample/AuthToken";
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

class AcmeCompanyApi implements CompanyApi {

    constructor(
        private readonly forGettingCauses: ForGettingCauses,
        private readonly forOpeningClaim: ForOpeningClaim,
        private readonly authTokenRetriever: AuthTokenRetriever) {
    }

    async open(claim: Claim): Promise<OpeningResult> {
        try {
            const token = await this.authTokenRetriever.retrieveToken();
            const causes = await this.forGettingCauses.getAllFor(claim, token);
            const cause = this.findCauseInClaim(causes, claim);
            const referenceInCompany = await this.forOpeningClaim.open(claim, cause, token);
            return OpeningResult.successful(referenceInCompany, claim);
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

    private findCauseInClaim(causes: Cause[], claim: Claim): Cause {
        let foundCause = causes.find((c) => c.causeCode === claim.causeCode());
        if (!foundCause) {
            throw new CannotFindMatchingCauseError();
        }
        return foundCause;
    }
}

describe('AcmeCompanyApi', () => {
    let forGettingCauses: jest.Mocked<ForGettingCauses>;
    let forOpeningClaim: jest.Mocked<ForOpeningClaim>;
    let authTokenRetriever: jest.Mocked<AuthTokenRetriever>;
    let authToken: AuthToken;
    let api: CompanyApi;
    let claim: Claim;

    let causeCodeInClaim = "lalala";

    beforeEach(() => {
        forGettingCauses = {
            getAllFor: jest.fn<Promise<Cause[]>, [Claim, AuthToken]>()
        };
        forOpeningClaim = {
            open: jest.fn<Promise<string>, [Claim, Cause, AuthToken]>()
        };
        authTokenRetriever = {
            retrieveToken: jest.fn<Promise<AuthToken>, []>()
        };

        authToken = {token: 'mi_token', type: 'Bearer'};
        api = createApi(forGettingCauses, forOpeningClaim, authTokenRetriever);
        claim = aClaim(causeCodeInClaim);
    });

    it('should fail when token retrieval throws error', async () => {
        when(authTokenRetriever.retrieveToken)
            .calledWith()
            .mockRejectedValue(new CannotRetrieveTokenError('Cannot retrieve token'));

        const result = await api.open(claim);

        expect(result).toEqual(new FailedOpening(
            claim,
            'Acme API: failure retrieving token'
        ));
    });

    it('should fail when getting causes throws error', async () => {
        when(authTokenRetriever.retrieveToken)
            .calledWith()
            .mockResolvedValue(authToken);

        when(forGettingCauses.getAllFor)
            .calledWith(claim, authToken)
            .mockRejectedValue(new CannotGetCausesError('Cannot retrieve causes'));

        const result = await api.open(claim);

        expect(result).toEqual(new FailedOpening(
            claim,
            'Acme API: failure getting claim causes'
        ));
    });

    it('should fail when finding matching cause throws error', async () => {
        const cause = new Cause('code not used in claim');
        when(authTokenRetriever.retrieveToken)
            .calledWith()
            .mockResolvedValue(authToken);

        when(forGettingCauses.getAllFor)
            .calledWith(claim, authToken)
            .mockResolvedValue([cause]);

        const result = await api.open(claim);

        expect(result).toEqual(new FailedOpening(
            claim,
            'Acme API: cannot find cause for claim 123456789'
        ));
    });

    it('should fail when opening claim throws error', async () => {
        const matchingCause = new Cause(causeCodeInClaim);
        when(authTokenRetriever.retrieveToken)
            .calledWith()
            .mockResolvedValue(authToken);

        when(forGettingCauses.getAllFor)
            .calledWith(claim, authToken)
            .mockResolvedValue([matchingCause]);

        when(forOpeningClaim.open)
            .calledWith(claim, matchingCause, authToken)
            .mockRejectedValue(new CannotOpenClaimError('Cannot open claim'));

        const result = await api.open(claim);

        expect(result).toEqual(new FailedOpening(
            claim,
            'Acme API: cannot open claim 123456789'
        ));
    });

    it('should fail when an unknown error occurs', async () => {
        const unknownError = new Error('Unexpected error');
        when(authTokenRetriever.retrieveToken)
            .calledWith()
            .mockRejectedValue(unknownError);

        const result = await api.open(claim);

        expect(result).toEqual(new FailedOpening(
            claim,
            `Acme API: Unexpected error`
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

    function createApi(forGettingCauses: ForGettingCauses, forOpeningClaim: ForOpeningClaim, authTokenRetriever: AuthTokenRetriever): CompanyApi {
        return new AcmeCompanyApi(forGettingCauses, forOpeningClaim, authTokenRetriever);
    }
});