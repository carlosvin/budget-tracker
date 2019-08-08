import { BudgetModel } from "./BudgetModel";
import { Expense, CurrencyRates, Budget } from "../interfaces";
import { ExpenseModel } from "./ExpenseModel";
import { uuid } from "./utils/uuid";
import { addDays, addDaysMs } from "./date";

function createBudget (currency: string, days: number, total: number) {
    const from = new Date();
    return { 
        currency: currency,
        from: from.getTime(),
        to: addDays(from, days).getTime(),
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
        when: budget.from
    };
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
        expect(bm.days).toBe(1);
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
            amountBaseCurrency: 98,
            categoryId: 'Category',
            countryCode: 'ES',
            currency: 'USD',
            description: 'whatever description',
            identifier: '1',
            when: expenseDate1.getTime(),
        };
        const expense2 = {...expense1,
            amount: 2,
            amountBaseCurrency: 2,
            currency: 'EUR',
            when: expenseDate2.getTime(),
            identifier: '2',
        };

        bm.setExpense(expense1);
        bm.setExpense(expense2);

        const expectedGroups = {
            [expenseDate1.getFullYear()]: { 
                [expenseDate1.getMonth()]: { 
                    [expenseDate1.getDate()]: {
                        [expense1.identifier]: new ExpenseModel(expense1)
                    }
                },
                [expenseDate2.getMonth()]: { 
                    [expenseDate2.getDate()]: {
                        [expense2.identifier]: new ExpenseModel(expense2)
                    } 
                }
            }
        };

        expect(bm.expenseGroups).toStrictEqual(expectedGroups);

        expect(bm.totalExpenses).toBe(100);
        expect(bm.expectedDailyExpensesAverage).toBe(17);

        expect(bm.average).toBe(100);
        expect(bm.getExpense(expense1.identifier)).toStrictEqual(new ExpenseModel(expense1));
        expect(bm.getExpense(expense2.identifier)).toStrictEqual(new ExpenseModel(expense2));
        expect(bm.totalExpenses).toBe(100);
        expect(bm.numberOfExpenses).toBe(2);
        expect(bm.days).toBe(1);
        expect(bm.totalDays).toBe(days);

        const expense2Updated = {...expense2, when: new Date().getTime()};
        // change the date of the expense2 so it is added to calculations
        bm.setExpense(expense2Updated);
        expect(bm.average).toBe(100);
        expect(bm.totalExpenses).toBe(100);

        // Modify budget dates to check that average is recalculated
        bm.setBudget({
            ...budget, 
            from: addDaysMs(budget.from, -1).getTime(), 
            to: addDaysMs(budget.to, 1).getTime()
        });
        expect(bm.days).toBe(2);
        expect(bm.totalDays).toBe(days + 2);
        expect(bm.average).toBe(50);
        expect(bm.totalExpenses).toBe(100);
        expect(bm.getExpense('1')).toStrictEqual(new ExpenseModel(expense1));
        expect(bm.getExpense('2')).toStrictEqual(new ExpenseModel(expense2Updated));

        const expectedGroupsUpdated = {
            [expenseDate1.getFullYear()]: { 
                [expenseDate1.getMonth()]: { 
                    [expenseDate1.getDate()]: {
                        [expense1.identifier]: new ExpenseModel(expense1),
                        [expense2Updated.identifier]: new ExpenseModel(expense2Updated)
                    }
                },
                [expenseDate2.getMonth()]: {
                    [expenseDate2.getDate()]: {}
                }
            }
        };

        expect(bm.expenseGroups).toStrictEqual(expectedGroupsUpdated);
    });
});

describe('Expense operations', () => {
    it('Remove expense', async () => {
        const budget = createBudget('EUR', 30, 1000);
        const expense1 = createExpense('1', budget);
        const expense2 = {...expense1, identifier: '2'};
        const expense3 = {...expense1, identifier: '3', when: addDaysMs(budget.to, 3).getTime()};
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
    
        const expense1Date = new Date(expense1.when);
        const expense2ModifiedDate = new Date(modifiedExpense2.when);
    
        const expenseGroups = {
            [expense1Date.getFullYear()]: {
                [expense1Date.getMonth()]: {
                    [expense1Date.getDate()]: {
                        [expense1.identifier]: new ExpenseModel(expense1)
                    }    
                }
            }
        }
    
        expenseGroups[expense2ModifiedDate.getFullYear()]
            [expense2ModifiedDate.getMonth()]
            [expense2ModifiedDate.getDate()]
            [modifiedExpense2.identifier] = new ExpenseModel(modifiedExpense2);
    
        expect(bm.expenseGroups).toStrictEqual(expenseGroups);
    
        const modifiedExpense2Date = {
            ...expense2, 
            when: addDaysMs(budget.from, 1).getTime()
        };
        
        bm.setExpense(modifiedExpense2Date);
        expect(bm.getExpense('1')).toStrictEqual(new ExpenseModel(expense1));

        expect(bm.totalExpenses).toBe(
            expense1.amountBaseCurrency + modifiedExpense2Date.amountBaseCurrency);
        expect(bm.getExpense('2').amountBaseCurrency)
            .toBe(modifiedExpense2Date.amountBaseCurrency);
    
        const expense2ModifiedDate2 = new Date(modifiedExpense2Date.when);
        const expenseGroupsModified = {
            [expense1Date.getFullYear()]: {
                [expense1Date.getMonth()]: {
                    [expense1Date.getDate()]: {
                        [expense1.identifier]: new ExpenseModel(expense1)
                    } ,
                    [expense2ModifiedDate2.getDate()]: {
                        [modifiedExpense2Date.identifier]: new ExpenseModel(modifiedExpense2Date)
                    }    
                }
            }
        }
            
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
    
});

describe('Expense groups in budget model', () => {
    it('Check groups are created properly when model is initialized from constructor', async () => {
        const budget = createBudget('EUR', 30, 1000);
        const expense1 = createExpense('1', budget);
        const expense2 = {...expense1,
            amount: 2,
            amountBaseCurrency: 2,
            currency: 'EUR',
            when: addDaysMs(budget.to,  2).getTime(),
            identifier: '2',
        };
        const bm = new BudgetModel(
            budget, 
            {
                [expense1.identifier]: expense1, 
                [expense2.identifier]: expense2, 
            });
    
    
        const expenseModel1 = new ExpenseModel(expense1);
        const {year, month, day} = expenseModel1;
    
        const expenseGroups = {
            [year]: {[month]: {[day]: {[expense1.identifier]: expenseModel1 }}}
        };
    
        const expenseModel2 = new ExpenseModel(expense2);
        expenseGroups[expenseModel2.year][expenseModel2.month] = {
            [expenseModel2.day]: {
                [expense2.identifier]: new ExpenseModel(expense2)
            }
        };
    
        expect(bm.expenseGroups).toStrictEqual(expenseGroups);
    
        expect(bm.totalExpenses).toBe(98);
        expect(bm.expectedDailyExpensesAverage).toBe(33);
    
        expect(bm.average).toBe(98);
        expect(bm.getExpense(expense1.identifier)).toStrictEqual(new ExpenseModel(expense1));
        expect(bm.getExpense(expense2.identifier)).toStrictEqual(new ExpenseModel(expense2));
        expect(bm.totalExpenses).toBe(98);
        expect(bm.numberOfExpenses).toBe(2);
        expect(bm.days).toBe(1);
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
        expect(Object.values(bm.expenses))
            .toStrictEqual(
                Object.values(expenses).map(e => new ExpenseModel(e)));

        const updatedInfo = {...bm.info, total: 20220};
        const expense0 = {...expense3, identifier: '0', currency: 'BTH', categoryId: 'General'};
        const updatedExpenses = {...expenses, '0': expense0};
        bm.setExpense(expense0);
        bm.setBudget(updatedInfo);

        expect(bm.info).toStrictEqual(updatedInfo);
        expect(Object.values(bm.expenses))
            .toStrictEqual(
                Object.values(updatedExpenses).map(e => new ExpenseModel(e)));

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

        expense1.countryCode = expense1.countryCode + '_VIS';
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
            const expense2 = {
                ...expense1, 
                identifier: '2',
                when: addDaysMs(expense1.when, 1).getTime()
            };
            const expense3 = {
                ...expense2, 
                identifier: '3',
                when: addDaysMs(expense2.when, 1).getTime()
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
                when: addDaysMs(expense3.when, 1).getTime(),
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
    }); 
});
