import { CategoriesMap, Category, Budget, Expense, CurrencyRates, CountryEntry, Importer, Exporter, BudgetsMap, YMD } from "../../api";
import { BudgetModel } from '../BudgetModel';
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import { LazyExoticComponent, ReactElement } from "react";

export interface CategoriesStore {
    getCategories(): Promise<CategoriesMap>;
    setCategories(categories: Category[]): Promise<void>;
    getCategory(categoryId: string): Promise<Category>;
    deleteCategory(categoryId: string): Promise<boolean>;
}

export interface BudgetsStore extends Importer, Exporter {

    getBudgetsIndex(): Promise<BudgetsMap>;
    getBudgetModel(budgetId: string): Promise<BudgetModel>;
    setBudget(budget: Budget): Promise<void>;

    getExpensesByDay(budgetId: string, date: YMD): Promise<Map<string, Expense>>;

    setExpenses(budgetId: string, expense: Expense[]): Promise<void>;
    getExpense(budgetId: string, expenseId: string): Promise<Expense>;
    deleteBudget(budgetId: string): Promise<void>;
    deleteExpense(budgetId: string, expenseId: string): Promise<void>;
}

export declare type LazyIcon = LazyExoticComponent<(props: SvgIconProps) => ReactElement>;

export interface ColoredLazyIcon {
    Icon: LazyIcon;
    color: string;
}

export interface IconsStore {
    readonly iconNames: string[];
    readonly defaultIcon: ColoredLazyIcon;

    getIcon(name: string): ColoredLazyIcon;
}

export interface CurrenciesStore {

    readonly currencies: Map<string, string>;

    /** 
     * @returns Currency exchange rate
     * @throws Error when there is no rate for that pair of currencies
     */
    getRate(baseCurrency: string, currencyTo: string): Promise<number>;

    /** 
     * @returns Currency exchange rates for a base currency
     */
    getRates(baseCurrency: string): Promise<CurrencyRates>;

    /** 
     * @returns Currency exchange rates for a base currency from local storage
     */
    getLocalRates(baseCurrency: string): CurrencyRates|undefined;


    /** 
     * @returns amount in base currency. \ 
     * If baseCurrency == currency it returns the same input @param amount.
     * It returns undefined if cannot get currency rate.
     * @throws Error when there is no rate for that pair of currencies
     */
    getAmountInBaseCurrency(
        baseCurrency: string,
        currency: string,
        amount: number): Promise<number>;

    getFromCountry(countryCode: string): Promise<string>;

    readonly lastCurrencyUsed?: string;
    readonly lastCurrenciesUsed: Iterable<string>;
    setLastCurrencyUsed (currency: string): void;
}

export interface CountriesStore {

    readonly countries: CountryEntry[];

    readonly currentCountryCode?: string;

    getCurrentCountry(): Promise<string | undefined>;
}
