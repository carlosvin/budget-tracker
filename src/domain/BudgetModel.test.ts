import { Expense, CurrencyRates, Category, ExpensesMap } from "../api";
import { ExpenseModel } from "./ExpenseModel";
import { DateDay } from "./DateDay";
import { BudgetModelImpl } from "./BudgetModelImpl";
import { createBudget } from "../__mocks__/createBudget";
import { createExpense } from "../__mocks__/createExpense";
import { dateDiff } from "./date";
import { ExpensesYearMap } from "./ExpensesYearMap";

describe('Budget Model Creation', () => {

    it('Budget model creation without expenses', async () => {
        const bm = new BudgetModelImpl(createBudget());
        expect(bm.totalExpenses).toBe(0);
        expect(bm.daysUntilToday).toBe(16);
        expect(bm.totalDays).toBe(30);
        expect(bm.expectedDailyExpensesAverage).toBe(33);
        expect(bm.expenseGroups).toStrictEqual(new ExpensesYearMap());
        expect(await bm.average).toBe(0);
        expect(() => bm.getExpense('whatever')).toThrowError('Expense with ID "whatever" not found');
        expect(await bm.totalExpenses).toBe(0);
        expect(bm.numberOfExpenses).toBe(0);
    });

    it('Budget model creation, no expenses, add them later', async () => {
        const days = 60;
        const budget = createBudget({}, days);
        const bm = new BudgetModelImpl(budget);
        const expenseDate1 = new Date(budget.from);
        const expenseDate2 = new Date(budget.to);
        const expense1: Expense = {
            ...createExpense('1', budget), 
            amount: 100, 
            amountBaseCurrency: 100,
            when: expenseDate1.getTime()
        };
        const expense2: Expense = {...expense1,
            currency: 'EUR',
            when: expenseDate2.getTime(),
            identifier: '2'
        };

        bm.setExpense(expense1);
        bm.setExpense(expense2);

        const expectedGroups = new ExpensesYearMap();
        const em1 = new ExpenseModel(expense1);
        const em2 = new ExpenseModel(expense2);
        expectedGroups.addExpense(em1);
        expectedGroups.addExpense(em2);

        expect(bm.expenseGroups).toStrictEqual(expectedGroups);

        expect(bm.totalExpenses).toBe(200);
        expect(bm.expectedDailyExpensesAverage).toBe(Math.round(bm.info.total / bm.totalDays));

        expect(bm.daysUntilToday).toBe(31);
        expect(bm.totalDays).toBe(days);
        expect(bm.average).toBe(Math.round(200/bm.daysUntilToday));
        expect(bm.getExpense(expense1.identifier).info).toStrictEqual(expense1);
        expect(bm.getExpense(expense2.identifier).info).toStrictEqual(expense2);
        expect(bm.totalExpenses).toBe(200);
        expect(bm.numberOfExpenses).toBe(2);

        // Modify budget dates to check that average is recalculated
        bm.setBudget({
            ...budget, 
            from: DateDay.fromTimeMs(budget.from).addDays(-30).timeMs, 
            to: DateDay.fromTimeMs(budget.to).addDays(30).timeMs
        });
        expect(bm.daysUntilToday).toBe(61);
        expect(bm.totalDays).toBe(days + 60);
        expect(bm.average).toBe(3);
        expect(bm.totalExpenses).toBe(200);
        expect(bm.getExpense('1').info).toStrictEqual(expense1);
        expect(bm.getExpense('2').info).toStrictEqual(expense2);

        expect(bm.expenseGroups).toStrictEqual(expectedGroups);
    });
});

describe('Expense operations', () => {
    it('Remove expense', () => {
        const budget = createBudget();
        const expense1 = createExpense('1', budget);
        const expense2 = {...expense1, identifier: '2'};
        const expense3 = {...expense1, identifier: '3', when: DateDay.fromTimeMs(budget.to).addDays(3).timeMs};
        const expense4 = {...expense1, identifier: '4', amountBaseCurrency: 55};
        const bm = new BudgetModelImpl(budget, [expense1, expense2, expense3, expense4]);

        expect(bm.totalExpenses).toBe(
            expense1.amountBaseCurrency + 
            expense2.amountBaseCurrency + 
            expense4.amountBaseCurrency);
    
        expect(bm.deleteExpense('6')).toBe(false);
        expect(bm.deleteExpense('2')).toBe(true);
        expect(bm.totalExpenses).toBe(
            expense1.amountBaseCurrency + 
            expense4.amountBaseCurrency);
        
        expect(bm.deleteExpense('3')).toBe(true);
        expect(bm.totalExpenses).toBe(
            expense1.amountBaseCurrency + 
            expense4.amountBaseCurrency);
    });
    
    it('Removes expense when it was manually removed from groups', () => {
        const budget = createBudget();
        const expense1 = createExpense('1', budget);
        const bm = new BudgetModelImpl(budget, [expense1]);
        bm.expenseGroups.deleteExpense(new ExpenseModel(expense1));
        expect(bm.deleteExpense('1')).toBe(true);
    });
    
    it('Modify expense amount', async () => {
        const budget = createBudget();
        const expense1 = createExpense('1', budget);
        const expense2 = {...expense1, identifier: '2'};
        const bm = new BudgetModelImpl(budget, [expense1, expense2]);
    
        const modifiedExpense2 = {
            ...expense2, 
            amountBaseCurrency: 10
        };
        bm.setExpense(modifiedExpense2);
        expect(bm.totalExpenses).toBe(
            expense1.amountBaseCurrency + 
            modifiedExpense2.amountBaseCurrency);
        expect(bm.getExpense('2').amountBaseCurrency)
            .toBe(modifiedExpense2.amountBaseCurrency);

        const expenseGroups = new ExpensesYearMap(); 
        expenseGroups.addExpense(new ExpenseModel(expense1));
        expenseGroups.addExpense(new ExpenseModel(modifiedExpense2));
    
        expect(bm.expenseGroups).toStrictEqual(expenseGroups);
    
        const modifiedExpense2Date = {
            ...expense2, 
            when: DateDay.fromTimeMs(budget.from).addDays(1).timeMs
        };
        
        bm.setExpense(modifiedExpense2Date);
        expect(bm.getExpense('1').info).toStrictEqual(expense1);

        expect(bm.totalExpenses).toBe(
            expense1.amountBaseCurrency + modifiedExpense2Date.amountBaseCurrency);
        expect(bm.getExpense('2').amountBaseCurrency)
            .toBe(modifiedExpense2Date.amountBaseCurrency);
    
        const expenseGroupsModified = new ExpensesYearMap();
        expenseGroupsModified.addExpense(new ExpenseModel(expense1));
        expenseGroupsModified.addExpense(new ExpenseModel(modifiedExpense2Date));
        expect(bm.expenseGroups).toStrictEqual(expenseGroupsModified);
    });

    it('Sets Expense without base amount throws error', () => {
        const info = createBudget({currency: 'USD', total: 56000}, 180);
        const expense1 = {...createExpense('1', info)};
        delete expense1['amountBaseCurrency'];
        const expenses = [expense1];

        const bm = new BudgetModelImpl(info);
        try {
            bm.setExpense(expense1);
            fail('Error should have happened');
        } catch (error) {
            expect(error).toBeTruthy();
        }

        try {
            new BudgetModelImpl(info, expenses);
            fail('Error should have happened');
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    it('Set Expense out of budget dates is possible, but expense will be ignored in calculations', () => {
        const info = createBudget({currency: 'USD', total: 56000}, 180);
        const expense1 = {
            ...createExpense('1', info), 
            when: DateDay.fromTimeMs(info.from).addDays(-1).timeMs};
        const expense2 = {
            ...createExpense('2', info), 
            when: DateDay.fromTimeMs(info.to).addDays(1).timeMs};

        const bm = new BudgetModelImpl(info, [expense1]);
        bm.setExpense(expense2);

        expect(bm.totalExpenses).toBe(0);
        expect(bm.average).toBe(0);        

    });

    it('Set expense split in dates with correct totals', () => {
        const info = createBudget({
            currency: 'USD', 
            total: 56000, 
            from: Date.now(), 
            to: new DateDay().addDays(5).timeMs});
        const expense1 = {
            ...createExpense('1', info), 
            splitInDays: 2};
        const expense2 = createExpense('2', info);
        const expense3 = {
            ...createExpense('3', info), splitInDays: 3};

        const bm = new BudgetModelImpl(info, [expense1, expense2]);
        bm.setExpense(expense3);

        expect(bm.totalExpenses).toBe(expense1.amountBaseCurrency * 3);
        expect(bm.average).toBe(
            (expense1.amountBaseCurrency * 3)/ dateDiff(info.from, Date.now()));
            
        const expense4 = createExpense('4', info);
        delete expense4['splitInDays'];
        bm.setExpense(expense4);
        expect(bm.average).toBe(
            (expense1.amountBaseCurrency * 4)/ dateDiff(info.from, Date.now()));
    });
    
});

describe('Expense groups in budget model', () => {
    it('Check groups are created properly when model is initialized from constructor', async () => {
        const budget = createBudget();
        const expense1 = createExpense('1', budget);
        const expense2 = {...expense1,
            amount: 2,
            amountBaseCurrency: 2,
            currency: 'EUR',
            when: DateDay.fromTimeMs(budget.to).addDays(2).timeMs,
            identifier: '2',
        };
        const bm = new BudgetModelImpl(budget, [expense1, expense2]);
    
        const expenseGroups = new ExpensesYearMap();
        expenseGroups.addExpense(new ExpenseModel(expense1));
        expenseGroups.addExpense(new ExpenseModel(expense2));
    
        expect(bm.expenseGroups).toStrictEqual(expenseGroups);
    
        expect(bm.totalExpenses).toBe(98);
        expect(bm.daysUntilToday).toBe(16);
        expect(bm.totalDays).toBe(30);
        expect(bm.expectedDailyExpensesAverage).toBe(33);
    
        expect(bm.average).toBe(Math.round(100/bm.daysUntilToday));
        expect(bm.getExpense(expense1.identifier).info).toStrictEqual(expense1);
        expect(bm.getExpense(expense2.identifier).info).toStrictEqual(expense2);
        expect(bm.totalExpenses).toBe(98);
        expect(bm.numberOfExpenses).toBe(2);
    
    }); 
});

describe('Budget attributes modifications', () => {

    it('Modify budget base currency ', async () => {
        const info = createBudget();
        const expense1 = {
            ...createExpense('1', info), 
            currency: 'USD', 
            amount: 12, 
            amountBaseCurrency: 10};
        const expense2 = {
            ...expense1, 
            identifier: '2', 
            currency: 'BTH', 
            amount: 350, 
            amountBaseCurrency: 10};
        const expense3 = {
            ...expense1, 
            identifier: '3', 
            currency: 'EUR', 
            amount: 1, 
            amountBaseCurrency: 1};
        const bm = new BudgetModelImpl(info, [expense1, expense2,expense3]);
    
        const rates: CurrencyRates = {
            base: 'USD',
            rates: { 'EUR': 0.8, 'BTH': 35 },
            date: new Date()
        };
        expect(bm.totalExpenses).toBe(21);
    
        await bm.setBudget({...info, currency: 'USD'}, rates);
        expect(bm.totalExpenses).toBe(23.25);
    });
    
    it('Modify budget base currency not passing currency rates. Throws error.', async () => {
        const info = createBudget();
        const expense1 = {
            ...createExpense('1', info), 
            currency: 'USD', 
            amount: 12, 
            amountBaseCurrency: 10};
        const expense2 = {
            ...expense1, 
            identifier: '2', 
            currency: 'BTH', 
            amount: 350, 
            amountBaseCurrency: 10};
        const expense3 = {
            ...expense1, 
            identifier: '3', 
            currency: 'EUR', 
            amount: 1, 
            amountBaseCurrency: 1};
        const bm = new BudgetModelImpl(info, [ expense1, expense2, expense3]);
        await expect(bm.setBudget({...info, currency: 'USD'}))
            .rejects
            .toThrowError('Required conversion rates to update budget currency');
    
        const rates: CurrencyRates = {
            base: 'USD',
            rates: { 'BTH': 35 },
            date: new Date()
        };
        await expect(bm.setBudget({...info, currency: 'USD'}, rates))
            .rejects
            .toThrowError('Cannot get currency exchange rate from USD to EUR');
    });
    
    it('Returns expenses and info attributes', async () => {
        const info = createBudget({currency: 'USD', total: 56000}, 180);
        const expense1 = {...createExpense('1', info)};
        const expense2 = {...expense1, identifier: '2', currency: 'ARS', amount: 3040, amountBaseCurrency: 10};
        const expense3 = {...expense1, identifier: '3', currency: 'EUR', amount: 101, amountBaseCurrency: 105.2};
        const expenses = {
            '1': expense1,
            '2': expense2,
            '3': expense3
        };
        const bm = new BudgetModelImpl(info, Object.values(expenses));

        expect(bm.info).toStrictEqual(info);
        expect(Array.from(bm.expenses).map(e => e.info))
            .toStrictEqual(Object.values(expenses));

        const updatedInfo = {...bm.info, total: 20220};
        const expense0 = {...expense3, identifier: '0', currency: 'BTH', categoryId: 'General'};
        const updatedExpenses = [...Object.values(expenses), expense0];
        bm.setExpense(expense0);
        bm.setBudget(updatedInfo);

        expect(bm.info).toStrictEqual(updatedInfo);
        expect(Array.from(bm.expenses).map(e => e.info))
            .toStrictEqual(updatedExpenses);

        await expect(bm.setBudget({...updatedInfo, identifier: 'invalid'}))
            .rejects
            .toThrowError('Cannot update budget information with different IDs');
    });
});

describe('Number of days in a country', () => { 

    it ('List of years with expenses', () => {
        const info = createBudget({total: 10000}, 365 * 4);
        const fromDate = new DateDay(new Date(info.from));
        const expenses = [{
                ...createExpense('1', info), 
                when: new Date(fromDate.year + 3, fromDate.month, fromDate.day).getTime()
            },
            createExpense('2', info)];
        const {expenseGroups} = new BudgetModelImpl(info, expenses);

        expect(Array.from(expenseGroups.years))
            .toEqual([fromDate.year + 3, fromDate.year]);
    });

    it ('List of days with expenses in a year/month', () => {
        const info = createBudget({total: 10000}, 365 * 4);
        const day1 = DateDay.fromTimeMs(info.from);
        const day2 = day1.clone().addDays(2);

        const expenses: ExpensesMap = {
            '1': {
                ...createExpense('1', info), 
                when: day1.timeMs},
            '2': {
                ...createExpense('2', info), 
                when: day2.timeMs
            }
        };
        const model = new BudgetModelImpl(info, Object.values(expenses));
        const {expenseGroups} = model;

        if (day1.month === day2.month) {
            expect(
                Array.from(expenseGroups.getDays(day1.year, day1.month))
            ).toStrictEqual([day1.day, day2.day]);    
        } else {
            expect(
                expenseGroups.getDays(day1.year, day1.month)
            ).toStrictEqual([day1.day]);    
            expect(
                expenseGroups.getDays(day2.year, day2.month)
            ).toStrictEqual([day2.day]);    
        }
    });

    it( 'Totals by dates', () => {
        const info = createBudget({total: 1000, currency: 'USD'}, 10);
        const bm = new BudgetModelImpl(info);
        const expense1 = createExpense('1', bm.info);
        const date1 = DateDay.fromTimeMs(expense1.when);
        expect(bm.getTotalExpensesByDay(date1.year, date1.month, date1.day)).toBe(0);
        expect(bm.getTotalExpensesByMonth(date1.year, date1.month)).toBe(0);
        expect(bm.getTotalExpensesByYear(date1.year)).toBe(0);

        bm.setExpense(expense1);
        expect(
            bm.getTotalExpensesByDay(date1.year, date1.month, date1.day)
        ).toBe(expense1.amountBaseCurrency);
        expect(
            bm.getTotalExpensesByMonth(date1.year, date1.month)
        ).toBe(expense1.amountBaseCurrency);
        expect(
            bm.getTotalExpensesByYear(date1.year)
        ).toBe(expense1.amountBaseCurrency);

        const expense2 = {...expense1, identifier: '2'};
        bm.setExpense(expense2);
        expect(
            bm.getTotalExpensesByDay(date1.year, date1.month, date1.day)
        ).toBe(expense1.amountBaseCurrency + expense2.amountBaseCurrency);
        expect(
            bm.getTotalExpensesByMonth(date1.year, date1.month)
        ).toBe(expense1.amountBaseCurrency + expense2.amountBaseCurrency);
        expect(
            bm.getTotalExpensesByYear(date1.year)
        ).toBe(expense1.amountBaseCurrency + expense2.amountBaseCurrency);            
    });

});

describe('Serialization', () => {
    it ('JSON', () => {
        const budgetInfo = createBudget({total: 5000}, 66);
        const expense1 = createExpense('1', budgetInfo);
        const expenseOtherId = createExpense('OtherId', budgetInfo);
        const expense2 = createExpense('2', budgetInfo);
        
        const expenses: ExpensesMap = {'1': expense1, 'OtherId': expenseOtherId};
        const model = new BudgetModelImpl(budgetInfo, Object.values(expenses));
        model.setExpense(expense2);
        expenses[expense2.identifier] = expense2;

        const category: Category = {
            identifier: expense1.categoryId, 
            name: expense1.categoryId, 
            icon: expense1.categoryId};
        const categories = {[category.identifier]: category};
        const exportedData = model.export({[category.identifier]: category});
        // ignore this timestamp
        delete exportedData['lastTimeSaved'];

        expect(exportedData).toStrictEqual(
            {
                budgets: {[budgetInfo.identifier]: budgetInfo},
                expenses,
                categories 
            }
        );
    }); 
});

