import {
    BankingServices,
    ExternalRouter,
    Inventory,
    Message,
    MessageRouter, Money,
    RegisterSale,
    SmokeTest,
    User
} from "../src";

describe('Testing', () => {
    test('should bla bla', () => {
        SmokeTest.HelloWorld();
        expect(true).toBe(true);
    });
});

describe("MessageRouter", () => {
    afterEach(() => {
        // to keep tests isolated
        ExternalRouter.setInstanceForTesting(null);
    });

    it('routes message', () => {
        const externalRouter: jest.Mocked<ExternalRouter> = { sendMessage: jest.fn() };
        ExternalRouter.setInstanceForTesting(externalRouter);
        const messageRouter = new MessageRouter();
        const message = new Message();

        messageRouter.route(message);

        expect(externalRouter.sendMessage).toHaveBeenCalledWith(message);
    });

    // more tests...

});

describe("User", () => {
    it('updates balance', () => {
        const bankingServices: jest.Mocked<BankingServices> = { updateBalance: jest.fn() };
        const userId = 1;
        const user = new User(userId, bankingServices);
        const amount = new Money(200);

        user.updateBalance(amount);

        expect(bankingServices.updateBalance).toHaveBeenCalledWith(userId, amount); // in this case sensing
    });

    // more tests...

});

