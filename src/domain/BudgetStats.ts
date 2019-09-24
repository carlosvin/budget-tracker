import { BudgetModel } from "./BudgetModel";
import { NestedTotal } from "./NestedTotal";
import { DateDay } from "./DateDay";
import { ExpenseModel } from "./ExpenseModel";
import { Expense, ExpensesMap, ExpensesYearMap } from "../interfaces";

export class BudgetStatsByCountry {
    
    private readonly _budgetModel: BudgetModel;
    private _totalsByCountry?: NestedTotal;

    constructor (budgetModel: BudgetModel) {
        this._budgetModel = budgetModel;
    }

    get totalsByCountry () {
        if (this._totalsByCountry === undefined) {
            this._totalsByCountry = new NestedTotal();
            const toMs = Math.min(new DateDay().timeMs, this._budgetModel.to);
            Object
                .values(this._budgetModel.expenses)
                .filter(e => e.inDates(this._budgetModel.from, toMs))
                .forEach((e) => this._addTotalsByCountry(e));
        }
        return this._totalsByCountry;
    }

    private _addTotalsByCountry (expense: ExpenseModel) {
        const toMs = Math.min(new DateDay().timeMs, this._budgetModel.to);
        if (this._totalsByCountry && expense.inDates(this._budgetModel.from, toMs)) {
            this._totalsByCountry.add(
                expense.amountBaseCurrency, [expense.countryCode,]);
        }
    }
}


export class BudgetStatsByCategory {
    
    private readonly _expenses: ExpensesMap;
    private _totalsByCategories?: NestedTotal;

    constructor (budgetModel: BudgetModel) {
        this._expenses = budgetModel.expenses;
    }

    
    get totalsByCategory () {
        if (this._totalsByCategories === undefined) {
            this._totalsByCategories = new NestedTotal();
            Object.values(this._expenses).forEach((e) => this._addTotalsByCategory(e));
        }
        return this._totalsByCategories;
    }

    private _addTotalsByCategory (expense: Expense) {
        if (this._totalsByCategories) {
            this._totalsByCategories.add(
                expense.amountBaseCurrency, [expense.categoryId,]);
        }
    }
}

export class TotalDaysByCountry {

    readonly daysByCountry: {[country: string]: number};

    constructor (budgetModel: BudgetModel) {
        this.daysByCountry = this.getTotalDaysByCountry(
            budgetModel.expenseGroups,
            budgetModel.from
        );
    }

    private getTotalDaysByCountry (groups: ExpensesYearMap, fromMs: number) {
        const daysByCountry: {[country: string]: number} = {};
        const todayMs = Date.now();
        let from = DateDay.fromTimeMs(fromMs);
        do {
            const {year, month, day} = from;
            if (year in groups && 
                month in groups[year] && 
                day in groups[year][month]) {
                const countriesInADay = new Set<string>();
                for (const id in groups[year][month][day]) {
                    const expense = groups[year][month][day][id];
                    countriesInADay.add(expense.countryCode);
                }
                countriesInADay.forEach(c=> {
                    if (c in daysByCountry) {
                        daysByCountry[c] += 1;
                    } else {
                        daysByCountry[c] = 1;
                    }
                });
            }
            from.addDays(1);
        } while (from.timeMs <= todayMs);
        return daysByCountry;
    }
}
