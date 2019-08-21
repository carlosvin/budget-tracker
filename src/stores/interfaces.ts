import { Categories, Category, Budget, Expense, ExpensesMap, CurrencyRates, CountryEntry } from "../interfaces";
import { BudgetModel } from '../domain/BudgetModel';
import { SvgIconProps } from "@material-ui/core/SvgIcon";

export interface CategoriesStore {
    getCategories(): Promise<Categories>;
    setCategories(categories: Categories): Promise<void>;
    setCategory(category: Category): Promise<void>;
    getCategory(categoryId: string): Promise<Category>;
    delete(categoryId: string): Promise<boolean>;
}

export interface BudgetsStore {

    getBudgetModel(budgetId: string): Promise<BudgetModel>;
    setBudget(budget: Budget): Promise<void>;

    getExpensesByDay(budgetId: string, y: number, m: number, d: number): Promise<ExpensesMap>;

    setExpenses(budgetId: string, expense: Expense[]): Promise<void>;
    getExpense(budgetId: string, expenseId: string): Promise<Expense>;
    deleteBudget(budgetId: string): Promise<void>;
    deleteExpense(budgetId: string, expenseId: string): Promise<void>;
}

export declare type LazyIcon = React.LazyExoticComponent<React.ComponentType<SvgIconProps>>;

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
    getCurrencies(): Promise<{ [currency: string]: string }>;

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
     * @returns amount in base currency. \ 
     * If baseCurrency == currency it returns the same input @param amount.
     * It returns undefined if cannot get currency rate.
     * @throws Error when there is no rate for that pair of currencies
     */
    getAmountInBaseCurrency (
        baseCurrency: string, 
        currency: string, 
        amount: number): Promise<number>;

    getFromCountry (countryCode: string): Promise<string>;

    readonly lastCurrencyUsed?: string;
}

export interface CountriesStore {

    getCountries(): Promise<CountryEntry[]>;

    readonly currentCountryCode: string;

    getCurrentCountry (): Promise<string>;
}
