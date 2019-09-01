import { BudgetModel } from "./BudgetModel";
import { Expense, CurrencyRates, Budget, Category, ExpensesMap, ExpensesYearMap } from "../interfaces";
import { ExpenseModel } from "./ExpenseModel";
import { uuid } from "./utils/uuid";
import { DateDay } from "./DateDay";

function createBudget (currency: string, days: number, total: number) {
    const from = new DateDay().addDays(-(Math.round(days/2)));
    const to = from.clone().addDays(days);
    return { 
        currency: currency,
        from: from.timeMs,
        to: to.timeMs,
        identifier: uuid(),
        name: 'Test',
        total: total
    };
}

function createExpense (id: string, budget: Budget) {
    return {
        amount: 100,
        amountBaseCurrency: 98,
        categoryId: 'Category',
        countryCode: 'ES',
        currency: 'USD',
        description: 'whatever description',
        identifier: id,
        when: budget.from + 1000
    };
}

function addExpenseToGroups (groups: ExpensesYearMap, expense: ExpenseModel) {
    const {year, month, day} = expense;
    if (!(year in groups)) {
        groups[year] = {};
    }
    if (!(month in groups[year])) {
        groups[year][month] = {};
    }
    if (!(day in groups[year][month])) {
        groups[year][month][day] = {};
    }
    groups[year][month][day][expense.identifier] = expense;

}

describe('Budget Model Creation', () => {

    it('Budget model creation without expenses', async () => {
        const bm = new BudgetModel(createBudget('EUR', 30, 1000), {});
        expect(bm.totalExpenses).toBe(0);
        expect(bm.expectedDailyExpensesAverage).toBe(33);
        expect(bm.expenseGroups).toStrictEqual({});
        expect(await bm.average).toBe(0);
        expect(bm.getExpense('whatever')).toBe(undefined);
        expect(await bm.totalExpenses).toBe(0);
        expect(bm.numberOfExpenses).toBe(0);
        expect(bm.days).toBe(16);
        expect(bm.totalDays).toBe(30);
    });

    it('Budget model creation, no expenses, add them later', async () => {
        const days = 60;
        const budget = createBudget('EUR', days, 1000);
        const bm = new BudgetModel(budget, {});
        const expenseDate1 = new Date(budget.from);
        const expenseDate2 = new Date(budget.to);
        const expense1: Expense = {
            amount: 100,
            amountBaseCurrency: 100,
            categoryId: 'Category',
            countryCode: 'ES',
            currency: 'USD',
            description: 'whatever description',
            identifier: '1',
            when: expenseDate1.getTime(),
        };
        const expense2 = {...expense1,
            currency: 'EUR',
            when: expenseDate2.getTime(),
            identifier: '2',
        };

        bm.setExpense(expense1);
        bm.setExpense(expense2);

        const expectedGroups = {};
        const em1 = new ExpenseModel(expense1);
        const em2 = new ExpenseModel(expense2);
        addExpenseToGroups(expectedGroups, em1);
        addExpenseToGroups(expectedGroups, em2);

        expect(bm.expenseGroups).toStrictEqual(expectedGroups);

        expect(bm.totalExpenses).toBe(200);
        expect(bm.expectedDailyExpensesAverage).toBe(17);

        expect(bm.totalDays).toBe(days);
        expect(bm.days).toBe(31);
        expect(bm.average).toBe(Math.round(200/bm.days));
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
        expect(bm.days).toBe(61);
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
        const budget = createBudget('EUR', 30, 1000);
        const expense1 = createExpense('1', budget);
        const expense2 = {...expense1, identifier: '2'};
        const expense3 = {...expense1, identifier: '3', when: DateDay.fromTimeMs(budget.to).addDays(3).timeMs};
        const expense4 = {...expense1, identifier: '4', amountBaseCurrency: 55};
        const bm = new BudgetModel(
            createBudget('EUR', 30, 1000),
            {
                '1': expense1,
                '2': expense2,
                '3': expense3,
                '4': expense4,
            });

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
        const budget = createBudget('EUR', 30, 1000);
        const expense1 = createExpense('1', budget);
        const bm = new BudgetModel(
            createBudget('EUR', 30, 1000), 
            {
                '1': expense1,
            });
        const {year, month, day} = new ExpenseModel(expense1);
        delete bm.expenseGroups[year][month][day];
        expect(bm.deleteExpense('1')).toBe(true);

    });
    
    it('Modify expense amount', async () => {
        const budget = createBudget('EUR', 30, 1000);
        const expense1 = createExpense('1', budget);
        const expense2 = {...expense1, identifier: '2'};
        const bm = new BudgetModel(
            budget, 
            {
                '1': expense1,
                '2': expense2
            });
    
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

        const expenseGroups = {}; 
        addExpenseToGroups(expenseGroups, new ExpenseModel(expense1));
        addExpenseToGroups(expenseGroups, new ExpenseModel(modifiedExpense2));
    
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
    
        const expenseGroupsModified = {};
        addExpenseToGroups(expenseGroupsModified, new ExpenseModel(expense1));
        addExpenseToGroups(expenseGroupsModified, new ExpenseModel(modifiedExpense2Date));

        expect(bm.expenseGroups).toStrictEqual(expenseGroupsModified);
    
    });

    it('Sets Expense without base amount throws error', () => {
        const info = createBudget('USD', 180, 56000);
        const expense1 = {...createExpense('1', info)};
        delete expense1['amountBaseCurrency'];
        const expenses = {
            '1': expense1,
        }

        const bm = new BudgetModel(info, {});
        try {
            bm.setExpense(expense1);
            fail('Error should have happened');
        } catch (error) {
            expect(error).toBeTruthy();
        }

        try {
            new BudgetModel(info, expenses);
            fail('Error should have happened');
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    it('Set Expense out of budget dates is possible, but expense will be ignored in calculations', () => {
        const info = createBudget('USD', 180, 56000);
        const expense1 = {
            ...createExpense('1', info), 
            when: DateDay.fromTimeMs(info.from).addDays(-1).timeMs};
        const expense2 = {
            ...createExpense('2', info), 
            when: DateDay.fromTimeMs(info.to).addDays(1).timeMs};

        const bm = new BudgetModel(info, {'1': expense1 });
        bm.setExpense(expense2);

        expect(bm.totalExpenses).toBe(0);
        expect(bm.average).toBe(0);        

    });
    
});

describe('Expense groups in budget model', () => {
    it('Check groups are created properly when model is initialized from constructor', async () => {
        const budget = createBudget('EUR', 30, 1000);
        const expense1 = createExpense('1', budget);
        const expense2 = {...expense1,
            amount: 2,
            amountBaseCurrency: 2,
            currency: 'EUR',
            when: DateDay.fromTimeMs(budget.to).addDays(2).timeMs,
            identifier: '2',
        };
        const bm = new BudgetModel(
            budget, 
            {
                [expense1.identifier]: expense1, 
                [expense2.identifier]: expense2, 
            });
    
        const expenseGroups = {};
        addExpenseToGroups(expenseGroups, new ExpenseModel(expense1));
        addExpenseToGroups(expenseGroups, new ExpenseModel(expense2));
        
    
        expect(bm.expenseGroups).toStrictEqual(expenseGroups);
    
        expect(bm.totalExpenses).toBe(98);
        expect(bm.expectedDailyExpensesAverage).toBe(33);
    
        expect(bm.average).toBe(Math.round(100/bm.days));
        expect(bm.getExpense(expense1.identifier).info).toStrictEqual(expense1);
        expect(bm.getExpense(expense2.identifier).info).toStrictEqual(expense2);
        expect(bm.totalExpenses).toBe(98);
        expect(bm.numberOfExpenses).toBe(2);
        expect(bm.days).toBe(16);
        expect(bm.totalDays).toBe(30);
    
    }); 
});

describe('Budget attributes modifications', () => {

    it('Modify budget base currency ', async () => {
        const info = createBudget('EUR', 30, 1000);
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
        const bm = new BudgetModel(
            info, 
            {
                '1': expense1,
                '2': expense2,
                '3': expense3
            });
    
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
        const info = createBudget('EUR', 30, 1000);
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
        const bm = new BudgetModel(
            info, 
            {
                '1': expense1,
                '2': expense2,
                '3': expense3
            });
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
        const info = createBudget('USD', 180, 56000);
        const expense1 = {...createExpense('1', info)};
        const expense2 = {...expense1, identifier: '2', currency: 'ARS', amount: 3040, amountBaseCurrency: 10};
        const expense3 = {...expense1, identifier: '3', currency: 'EUR', amount: 101, amountBaseCurrency: 105.2};
        const expenses = {
            '1': expense1,
            '2': expense2,
            '3': expense3
        };
        const bm = new BudgetModel(info, expenses);

        expect(bm.info).toStrictEqual(info);
        expect(Object.values(bm.expenses).map(e => e.info))
            .toStrictEqual(
                Object.values(expenses));

        const updatedInfo = {...bm.info, total: 20220};
        const expense0 = {...expense3, identifier: '0', currency: 'BTH', categoryId: 'General'};
        const updatedExpenses = {...expenses, '0': expense0};
        bm.setExpense(expense0);
        bm.setBudget(updatedInfo);

        expect(bm.info).toStrictEqual(updatedInfo);
        expect(Object.values(bm.expenses).map(e => e.info))
            .toStrictEqual(
                Object.values(updatedExpenses));

        await expect(bm.setBudget({...updatedInfo, identifier: 'invalid'}))
            .rejects
            .toThrowError('Cannot update budget information with different IDs');

    });
});


describe('Budget model statistics', () => {

    it('Totals by category', () => {
        const info = createBudget('USD', 60, 12000);
        const expense1 = createExpense('1', info);
        const expense2 = {
            ...expense1, 
            identifier: '2'};
        const expense3 = {
            ...expense2,
            identifier: '3',
            categoryId: 'Category 3'
        };
        const bm = new BudgetModel(
            info, 
            {
                '1': expense1,
                '2': expense2,
                '3': expense3
            });

        expect(bm.totalsByCategory.getSubtotal(['Category', ]))
            .toBe(expense1.amountBaseCurrency + expense2.amountBaseCurrency);
        expect(bm.totalsByCategory.getSubtotal([expense3.categoryId, ]))
            .toBe(expense3.amountBaseCurrency);
        
        const expense4 = {
            ...expense3,
            identifier: '4',
        };
        bm.setExpense(expense4);
        expect(bm.totalsByCategory.getSubtotal([expense3.categoryId, ]))
            .toBe(expense3.amountBaseCurrency + expense4.amountBaseCurrency);

        expense1.categoryId = expense1.categoryId + ' new';
        bm.setExpense(expense1);
        expect(bm.totalsByCategory.getSubtotal([expense1.categoryId, ]))
            .toBe(expense1.amountBaseCurrency);
        expect(bm.totalsByCategory.getSubtotal([expense2.categoryId, ]))
            .toBe(expense2.amountBaseCurrency);
        expect(bm.totalsByCategory.getSubtotal([expense3.categoryId, ]))
            .toBe(expense3.amountBaseCurrency + expense4.amountBaseCurrency);

        expense1.categoryId = expense2.categoryId = expense3.categoryId = expense4.categoryId;
        bm.setExpense(expense1);
        bm.setExpense(expense2);
        bm.setExpense(expense3);
        bm.setExpense(expense4);
        expect(bm.totalsByCategory.getSubtotal([expense1.categoryId, ]))
            .toBe(
                expense1.amountBaseCurrency + 
                expense2.amountBaseCurrency + 
                expense3.amountBaseCurrency + 
                expense4.amountBaseCurrency);

        bm.deleteExpense(expense1.identifier);
        bm.deleteExpense(expense4.identifier);
        expect(bm.totalsByCategory.getSubtotal([expense2.categoryId, ]))
            .toBe(
                expense2.amountBaseCurrency + 
                expense3.amountBaseCurrency);
    });

    it('Totals by country', () => {
        const info = createBudget('USD', 60, 12000);
        const expense1 = createExpense('1', info);
        const expense2 = {
            ...expense1, 
            identifier: '2'};
        const expense3 = {
            ...expense2,
            identifier: '3',
            countryCode: 'AA'
        };
        const bm = new BudgetModel(
            info, 
            {
                '1': expense1,
                '2': expense2,
                '3': expense3
            });

        expect(bm.totalsByCountry.getSubtotal([expense1.countryCode, ]))
            .toBe(expense1.amountBaseCurrency + expense2.amountBaseCurrency);
        expect(bm.totalsByCountry.getSubtotal([expense3.countryCode, ]))
            .toBe(expense3.amountBaseCurrency);
        
        const expense4 = {
            ...expense3,
            identifier: '4',
        };
        bm.setExpense(expense4);
        expect(bm.totalsByCountry.getSubtotal([expense3.countryCode, ]))
            .toBe(expense3.amountBaseCurrency + expense4.amountBaseCurrency);

        expense1.countryCode = 'OO';
        bm.setExpense(expense1);
        expect(bm.totalsByCountry.getSubtotal([expense1.countryCode, ]))
            .toBe(expense1.amountBaseCurrency);
        expect(bm.totalsByCountry.getSubtotal([expense2.countryCode, ]))
            .toBe(expense2.amountBaseCurrency);
        expect(bm.totalsByCountry.getSubtotal([expense3.countryCode, ]))
            .toBe(expense3.amountBaseCurrency + expense4.amountBaseCurrency);

        expense1.countryCode = expense2.countryCode = expense3.countryCode = expense4.countryCode;
        bm.setExpense(expense1);
        bm.setExpense(expense2);
        bm.setExpense(expense3);
        bm.setExpense(expense4);
        expect(bm.totalsByCountry.getSubtotal([expense1.countryCode, ]))
            .toBe(
                expense1.amountBaseCurrency + 
                expense2.amountBaseCurrency + 
                expense3.amountBaseCurrency + 
                expense4.amountBaseCurrency);

        bm.deleteExpense(expense1.identifier);
        bm.deleteExpense(expense4.identifier);
        expect(bm.totalsByCountry.getSubtotal([expense2.countryCode, ]))
            .toBe(
                expense2.amountBaseCurrency + 
                expense3.amountBaseCurrency);

        bm.setExpense({...expense1, identifier: '5', when: new DateDay().addDays(1).timeMs});
        expect(bm.totalsByCountry.getSubtotal([expense2.countryCode, ]))
        .toBe(
            expense2.amountBaseCurrency + 
            expense3.amountBaseCurrency);
    });

    describe('Number of days in a country', () => { 
        it('2 countries in same day', () => {
            const info = createBudget('USD', 60, 12000);
            const expense1 = createExpense('1', info);
            const expense2 = {
                ...expense1, 
                identifier: '2', 
                countryCode: 'FR'
            };
            const bm = new BudgetModel(
                info, 
                {
                    '1': expense1,
                    '2': expense2,
                });
    
            expect(bm.totalDaysByCountry).toStrictEqual({'ES': 1, 'FR': 1});
        });
    
        it('ES in 3 days, LU in 2 days', () => {
            const info = createBudget('USD', 60, 12000);
            const expense1 = createExpense('1', info);
            const expense2Date = DateDay.fromTimeMs(expense1.when).addDays(1);
            const expense2 = {
                ...expense1, 
                identifier: '2',
                when: expense2Date.timeMs
            };
            const expense3 = {
                ...expense2, 
                identifier: '3',
                when: expense2Date.clone().addDays(1).timeMs
            };
            const expense4 = {
                ...expense3, 
                identifier: '4',
                when: expense3.when,
                countryCode: 'LU'
            };
            const expense5 = {
                ...expense3, 
                identifier: '5',
                when: expense2Date.clone().addDays(2).timeMs,
                countryCode: 'LU'
            };
            const bm = new BudgetModel(
                info, 
                {
                    '1': expense1,
                    '2': expense2,
                    '3': expense3,
                    '4': expense4,
                    '5': expense5,
                });
    
            expect(bm.totalDaysByCountry).toStrictEqual(
                {'ES': 3, 'LU': 2}
            );
        });

        it('Ignores expenses in future', () => {
            const info = createBudget('USD', 60, 12000);
            const expense1 = createExpense('1', info);
            const expense2 = {
                ...expense1, 
                identifier: '2',
                when: DateDay.fromTimeMs(expense1.when).addDays(1).timeMs
            };
            // in future
            const expense3 = {
                ...expense2, 
                identifier: '3',
                when: new DateDay().addDays(1).timeMs
            };
            const expense4 = {
                ...expense3, 
                identifier: '4',
                when: expense1.when,
                countryCode: 'LU'
            };
            const expense5 = {
                ...expense3, 
                identifier: '5',
                when: new DateDay().addDays(2).timeMs,
                countryCode: 'LU'
            };
            const bm = new BudgetModel(
                info, 
                {
                    '1': expense1,
                    '2': expense2,
                    '3': expense3,
                    '4': expense4,
                    '5': expense5,
                });
    
            expect(bm.totalDaysByCountry).toStrictEqual(
                {'ES': 2, 'LU': 1}
            );
        });

        it ('List of years with expenses', () => {
            const info = createBudget('EUR', 365 * 4, 10000);
            const fromDate = new DateDay(new Date(info.from));
            const expenses: ExpensesMap = {
                '1': {
                    ...createExpense('1', info), 
                    when: new Date(fromDate.year + 3, fromDate.month, fromDate.day).getTime()},
                '2': createExpense('2', info)
            };
            const model = new BudgetModel(info, expenses);

            expect(model.years).toStrictEqual([fromDate.year + 3, fromDate.year]);
        });

        it ('List of days with expenses in a year/month', () => {
            const info = createBudget('EUR', 365 * 4, 10000);
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
            const model = new BudgetModel(info, expenses);

            if (day1.month === day2.month) {
                expect(
                    model.getDays(day1.year, day1.month)
                ).toStrictEqual([day2.day, day1.day]);    
            } else {
                expect(
                    model.getDays(day1.year, day1.month)
                ).toStrictEqual([day1.day]);    
                expect(
                    model.getDays(day2.year, day2.month)
                ).toStrictEqual([day2.day]);    
            }
        });

        it( 'Totals by dates', () => {
            const bm = new BudgetModel(createBudget('USD', 10, 1000));
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
            const budgetInfo = createBudget('EUR', 66, 5000);
            const expense1 = createExpense('1', budgetInfo);
            const expenseOtherId = createExpense('OtherId', budgetInfo);
            const expense2 = createExpense('2', budgetInfo);
            
            const expenses: ExpensesMap = {'1': expense1, 'OtherId': expenseOtherId};
            const model = new BudgetModel(budgetInfo, expenses);
            model.setExpense(expense2);
            expenses[expense2.identifier] = expense2;

            const category: Category = {
                id: expense1.categoryId, 
                name: expense1.categoryId, 
                icon: expense1.categoryId};
            const categories = {[category.id]: category};
            const exportedData = model.export({[category.id]: category});
            // ignore this timestamp
            delete exportedData['lastTimeSaved'];

            expect(exportedData).toStrictEqual(
                {
                    budgets: {[budgetInfo.identifier]: budgetInfo},
                    expenses: {[budgetInfo.identifier]: expenses},
                    categories 
                }
            );
            

        }); 
    });

});
