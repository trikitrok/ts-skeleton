export module SmokeTest {
    //noinspection JSUnusedGlobalSymbols
    export function HelloWorld() {
        console.log("Hello World");
    }
}

interface Display {
    show(message: string): void;
}

class Book {
    getName(): string {
        return "";
    }
}

class AcmeInputReader {
    readLine(): string {
        return "";
    }
}


class Library {
    private display: Display;

    constructor(display: Display) {
        this.display = display;
    }

    printBooks(books: Book[], inputReader: AcmeInputReader): void {
        const libraryData = new LibraryData(inputReader);
        const libraryName = libraryData.getLibraryName(); // <- moved method
        this.display.show(libraryName);
        for (const book of books) {
            this.display.show(book.getName());
        }
    }
}

// wrapper
class LibraryData {
    private readonly inputReader: AcmeInputReader;

    constructor(inputReader: AcmeInputReader) {
        this.inputReader = inputReader;
    }

    // moved method
    getLibraryName(): string {
        return this.inputReader.readLine();
    }
}


class AcmeLogger {
    public logTransaction(date: Date, value: number): void {
        // Logger implementation
    }
}

interface TransactionsRepository {
}

class Transaction {
}

class FileTransactionsRepository implements TransactionsRepository {
    public getAll(): Transaction[] {
        let transactions: Transaction[] = [];

        // read the transactions from some file...

        return transactions;
    }
}

class Account {
    private transactions: Transaction[];

    constructor() {
        this.transactions = this.getAllTransactions();
    }

    // made protected for testing :(
    protected getAllTransactions(): Transaction[] {
        return new FileTransactionsRepository().getAll();
    }

    // more code...
}

class ForTestingAccount extends Account {
    private static transactions: Transaction[];

    public static create(someTransactions: Transaction[]): Account {
        // The field transactions and its initialization need to be static
        // so that the field gets initialized before the super class constructor is called
        ForTestingAccount.transactions = someTransactions;
        return new ForTestingAccount();
    }

    private constructor() {
        super();
    }

    protected override getAllTransactions(): Transaction[] {
        return ForTestingAccount.transactions;
    }
}

export class Barcode {
}

export class Item {
}

export class Inventory {
    static getInstance(): Inventory {
        return new Inventory();
    }

    getItemForBarCode(code: Barcode): Item {
        return new Item();
    }
}

export class RegisterSale {
    // more code...
    private items: Item[];

    constructor() {
        this.items = [];
    }

    public addItem(code: Barcode): void {
        const newItem = this.getInventory().getItemForBarCode(code);
        this.items.push(newItem);
    }

    // made protected for testing
    protected getInventory(): Inventory {
        return Inventory.getInstance();
    }

    // more code...
}

export class Message {
}

export class MessageRouter {
    public route(message: Message): void {
        //!! ouch... x(
        ExternalRouter.getInstance().sendMessage(message);
    }
}

export class ExternalRouter {
    private static instance: ExternalRouter | null = null;

    private constructor() {
        // initialize stuff
    }

    public static getInstance(): ExternalRouter {
        if (this.instance === null) {
            this.instance = new ExternalRouter();
        }
        return this.instance;
    }

    //!! Added for testing purposes only, do not use this in production code
    public static setInstanceForTesting(instance: ExternalRouter | null): void {
        this.instance = instance;
    }

    // more code...
    public sendMessage(message: Message): void {
        // interesting code to send the message
    }
}

export class Money {
    constructor(amount: number) {

    }

    add(number: number) {

    }
}

export class BankingServices {
    public static updateAccountBalance(userId: number, amount: Money): void {
        // some code to update the account balance
    }

    //!! the instance delegator <- now we can Subclass & Override Method here!
    public updateBalance(userId: number, amount: Money): void {
        // it calls the static method
        BankingServices.updateAccountBalance(userId, amount);
    }

    // more methods...
}

export class User {
    private readonly id: number;
    private readonly bankingServices: BankingServices;

    //!! We used Parameterize Constructor to inject a BankingServices instance to User
    constructor(id: number, bankingServices: BankingServices) {
        this.id = id;
        this.bankingServices = bankingServices;
    }

    // more code...

    public updateBalance(amount: Money): void {
        this.bankingServices.updateBalance(this.id, amount);
    }

    // more code...
}

export class Point {
    x: number;
    y: number;
}

export class ColorMatrix {
    getColor(colorId: number): Color {
        return new Color()
    }
}

export class Color {
}

export interface PointRenderer {
    readonly colorId: number;

    drawPoint(x: number, y: number, color: Color): void;
}

export class Renderer {
    private readonly pointRenderer: PointRenderer;
    private readonly renderingRoots: Point[];
    private readonly colors: ColorMatrix;
    private readonly selection: Point[];

    // !!! -> the new class only see the new interface
    constructor(
        pointRenderer: PointRenderer,
        renderingRoots: Point[],
        colors: ColorMatrix,
        selection: Point[]
    ) {
        this.pointRenderer = pointRenderer;
        this.renderingRoots = renderingRoots;
        this.colors = colors;
        this.selection = selection;
    }

    public draw(): void {
        // some more code in the method
        for (const point of this.renderingRoots) {
            // a lot more code in the loop

            this.pointRenderer.drawPoint(point.x, point.y, this.colors.getColor(this.pointRenderer.colorId));
        }

        // a lot more code in the method
    }
}

export class GDIBrush implements PointRenderer {
    colorId: number;

    // A long method
    public draw(renderingRoots: Point[], colors: ColorMatrix, selection: Point[]): void {
        const renderer = new Renderer(this, renderingRoots, colors, selection);
        renderer.draw(); // !!! -> we call the method object
    }

    drawPoint(x: number, y: number, color: Color): void {
        // some code to draw a point...
    }
}

class BannerDao {
    findById(number: number) {
        return new Banner();
    }

    chooseRandomBanner() {
        return new Banner();
    }
}

class BannerCache {
    get(player: Player, page: Page) {
        return new Banner();
    }

    put(player: Player, page: Page, banner: Banner, number: number) {

    }
}

class Player {
    id: number;
}

class Banner {
    clientId: number;
}

class Page {
    id: string;
}

export class LegacyBannerAdChooser implements BannerAdChooser {
    private readonly bannerDao = new BannerDao();
    private readonly bannerCache = new BannerCache();

    public getAd(player: Player, page: Page): Banner {
        let banner: Banner;
        let showBanner = true;

        // First try the cache
        banner = this.bannerCache.get(player, page);

        if (player.id === 23759) {
            // This player demands not to be shown any ads.
            // See support ticket #4839
            showBanner = false;
        }

        if (page.id === "profile") {
            // Don't show ads on player profile page
            showBanner = false;
        }

        if (page.id === "top" && new Date().getDay() === 3) {
            // No ads on top page on Wednesdays
            showBanner = false;
        }

        if (player.id % 5 === 0) {
            // A/B test - show banner 123 to these players
            banner = this.bannerDao.findById(123);
        }

        if (showBanner && banner == null) {
            banner = this.bannerDao.chooseRandomBanner();
        }

        if (banner.clientId === 393) {
            if (player.id === 36645) {
                // Bad blood between this client and this player!
                // Don't show the ad.
                showBanner = false;
            }
        }

        // Cache our choice for 30 minutes
        this.bannerCache.put(player, page, banner, 30 * 60);

        // Dozens more checks and conditions ...

        if (showBanner) {
            // Make a record of what banner we chose
            this.logImpression(player, page, banner);
        }

        return banner;
    }

    private logImpression(player: Player, page: Page, banner: Banner): void {
        // Implementation for logging the impression
    }
}

export abstract class Rule {
    private readonly nextRule: Rule | null;

    protected constructor(nextRule: Rule | null = null) {
        this.nextRule = nextRule;
    }

    // Does this rule apply to the given player and page?
    protected abstract canApply(player: Player, page: Page): boolean;

    // Apply the rule to choose a banner to show.
    // Returns a banner, which may be null
    protected abstract apply(player: Player, page: Page): Banner | null;

    public chooseBanner(player: Player, page: Page): Banner | null {
        if (this.canApply(player, page)) {
            // Apply this rule
            return this.apply(player, page);
        } else if (this.nextRule != null) {
            // Try the next rule
            return this.nextRule.chooseBanner(player, page);
        } else {
            // Ran out of rules to try!
            return null;
        }
    }
}

export class ExcludeCertainPages extends Rule {
    // Pages on which banners should not be shown
    private static readonly pageIds: Set<string> = new Set(["profile"]);

    public constructor(nextRule: Rule | null = null) {
        super(nextRule);
    }

    protected canApply(player: Player, page: Page): boolean {
        return ExcludeCertainPages.pageIds.has(page.id);
    }

    protected apply(player: Player, page: Page): Banner | null {
        return null;
    }
}

export class ABTest extends Rule {
    private readonly dao: BannerDao;

    public constructor(dao: BannerDao, nextRule: Rule | null = null) {
        super(nextRule);
        this.dao = dao;
    }

    protected canApply(player: Player, page: Page): boolean {
        // Check if player is in A/B test segment
        return player.id % 5 === 0;
    }

    protected apply(player: Player, page: Page): Banner | null {
        // Show banner 123 to players in A/B test segment
        return this.dao.findById(123);
    }
}

class ChooseRandomBanner extends Rule {
    private readonly dao: BannerDao;

    constructor(dao: BannerDao, nextRule: Rule | null = null) {
        super(nextRule);
        this.dao = dao;
    }

    protected canApply(player: Player, page: Page): boolean {
        return true;
    }

    protected apply(player: Player, page: Page): Banner | null {
        return this.dao.chooseRandomBanner();
    }
}

export function buildChain(dao: BannerDao): Rule {
    return new ABTest(dao,
        new ExcludeCertainPages(
            new ChooseRandomBanner(dao)
        )
    );
}

export interface BannerAdChooser {
    getAd(player: Player, page: Page): Banner | null;
}

export class BaseBannerAdChooser implements BannerAdChooser {
    private readonly dao: BannerDao = new BannerDao();
    private readonly chain: Rule;

    public constructor() {
        this.chain = buildChain(this.dao);
    }

    public getAd(player: Player, page: Page): Banner | null {
        return this.chain.chooseBanner(player, page);
    }
}

export class CachingBannerAdChooser implements BannerAdChooser {
    private readonly cache: BannerCache = new BannerCache();
    private readonly baseChooser: BannerAdChooser;

    public constructor(baseChooser: BannerAdChooser) {
        this.baseChooser = baseChooser;
    }

    public getAd(player: Player, page: Page): Banner | null {
        const cachedBanner = this.cache.get(player, page);
        if (cachedBanner) {
            return cachedBanner;
        } else {
            // Delegate to the next layer
            const banner = this.baseChooser.getAd(player, page);
            // Store the result in the cache for 30 minutes
            if (banner) {
                this.cache.put(player, page, banner, 30 * 60);
            }
            return banner;
        }
    }
}

export class LoggingBannerAdChooser implements BannerAdChooser {
    private readonly baseChooser: BannerAdChooser;

    public constructor(baseChooser: BannerAdChooser) {
        this.baseChooser = baseChooser;
    }

    public getAd(player: Player, page: Page): Banner | null {
        // Delegate to the next layer
        const banner = this.baseChooser.getAd(player, page);
        if (banner) {
            // Record the impression of the chosen banner
            this.logImpression(player, page, banner);
        }
        return banner;
    }

    private logImpression(player: Player, page: Page, banner: Banner): void {
        // Logging logic here...
    }
}

export class BannerAdChooserFactory {
    public static create(): BannerAdChooser {
        return new LoggingBannerAdChooser( // the decorator
            new CachingBannerAdChooser( // the proxy
                new BaseBannerAdChooser() // the concrete class using the chain of responsibility inside
            )
        );
    }
}

enum RateCode {
    GOLD

}

class Customer {
    getRateCode(): RateCode {
        return RateCode.GOLD
    }
}

class FeeRider {
    getAmount() {
        return 0;
    }
}

class RentalCalendar {

    static weekRemainderFor(date: Date): number {
        return 0;
    }
}

class RateCalculator {

    static computeWeekly(rateCode: RateCode): number {
        return 0;
    }

    static rateBase(customer: Customer) {
        return 0;
    }
}

export class Reservation {
    private duration: number;
    private dailyRate: number;
    private readonly date: Date;
    private readonly customer: Customer;
    private readonly fees: FeeRider[];

    constructor(customer: Customer, duration: number, dailyRate: number, date: Date) {
        this.fees = [];
        this.customer = customer;
        this.duration = duration;
        this.dailyRate = dailyRate;
        this.date = date;
    }

    public extend(additionalDays: number): void {
        this.duration += additionalDays;
    }

    public extendForWeek(): void {
        const weekRemainder = RentalCalendar.weekRemainderFor(this.date);
        const DAYS_PER_WEEK = 7;
        this.extend(weekRemainder);
        this.dailyRate = RateCalculator.computeWeekly(this.customer.getRateCode()) / DAYS_PER_WEEK;
    }

    public addFee(rider: FeeRider): void {
        this.fees.push(rider);
    }

    public getTotalFee(): number {
        return this.getPrincipalFee() + this.getAdditionalFees();
    }

    private getAdditionalFees(): number {
        let total = 0;
        for (const fee of this.fees) {
            total += fee.getAmount();
        }
        return total;
    }

    private getPrincipalFee(): number {
        return this.dailyRate * RateCalculator.rateBase(this.customer) * this.duration;
    }
}

class Declaration {
    asAbstract() {
        return "";
    }
}

export class CppClass {
    private readonly name: string;
    private readonly declarations: Declaration[];

    constructor(name: string, declarations: Declaration[]) {
        this.name = name;
        this.declarations = declarations;
    }

    public getDeclarationCount(): number {
        return this.declarations.length;
    }

    public getName(): string {
        return this.name;
    }

    public getDeclaration(index: number): Declaration {
        return this.declarations[index];
    }

    public getInterface(interfaceName: string, indices: number[]): string {
        let result = "class " + interfaceName + " {\n public:\n";

        for (const index of indices) {
            const virtualFunction = this.declarations[index];
            result += "\t" + virtualFunction.asAbstract() + "\n";
        }

        result += "};\n";
        return result;
    }
}

export class Element {
    private readonly name: string;
    private text: string;

    constructor(name: string) {
        this.name = name;
        this.text = "";
    }

    addText(text: string): void {
        this.text += text;
    }

    getName(): string {
        return this.name;
    }

    getText(): string {
        return this.text;
    }
}

export class InMemoryDirectory {
    private readonly elements: Element[];

    constructor() {
        this.elements = [];
    }

    public addElement(newElement: Element): void {
        this.elements.push(newElement);
    }

    public generateIndex(): void {
        const index = new Element("index");
        for (const element of this.elements) {
            index.addText(element.getName() + "\n");
        }
        this.addElement(index);
    }

    public getElementCount(): number {
        return this.elements.length;
    }

    public getElement(name: string): Element | null {
        for (const element of this.elements) {
            if (element.getName() === name) {
                return element;
            }
        }
        return null;
    }
}

class TimeCard {
    hours: number;
}

class PayDispatcher {
    pay(employee: Employee, date: Date, amount: Money) {

    }
}

export class Employee {
    public timeCards: TimeCard[];
    public payPeriod: Date[];
    public date: Date;
    public payRate: number;
    public payDispatcher: PayDispatcher;

    public pay(): void {
        const amount = new Money(10);
        for (const card of this.timeCards) {
            if (this.payPeriod.includes(this.date)) {
                amount.add(card.hours * this.payRate);
            }
        }
        this.payDispatcher.pay(this, this.date, amount);
        // <-- this is the change point
    }
}

class Logger {
}

export class LoggingEmployee {
    private readonly employee: Employee;
    private readonly logger: Logger;

    constructor(employee: Employee, logger: Logger) {
        this.employee = employee;
        this.logger = logger;
    }

    public pay(): void { // <-- pay with logging
        this.employee.pay(); // <-- delegates to original method
        this.logPayment(); // <-- log payment
    }

    private logPayment(): void {
        // log employee data
    }
}


export class ConjugatedGradient {
    private readonly tolerance: number;
    private readonly maxIterations: number;

    constructor(tolerance: number = 1e-6, maxIterations: number = 1000) {
        this.tolerance = tolerance;
        this.maxIterations = maxIterations;
    }

    minimize(gradFn: (x: number[]) => number[], init: number[]): number[] {
        // more code...
        return [];
    }

    // more code...
}

interface Minimization {
    minimize(
        gradFn: (x: number[]) => number[],
        init: number[]
    ): number[];
}

export class LinearDescent  {

    min(
        gradFn: (x: number[]) => number[],
        init: number[],
        config?: {
            tolerance?: number;
            maxIterations?: number;
            learningRate?: number;
        }
    ): number[] {
        // more code...
        return [];
    }

    // more code...
}

