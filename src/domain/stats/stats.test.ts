import { createBudget } from "../../__mocks__/createBudget";
import { createExpense } from "../../__mocks__/createExpense";
import { BudgetModelImpl } from "../BudgetModelImpl";
import { getTotalsByCategory } from "./getTotalsByCategory";
import { getTotalsByCountry } from "./getTotalsByCountry";
import { DateDay } from "../DateDay";
import { getTotalDaysByCountry } from "./getTotalDaysByCountry";
import { ExpensesMap } from "../../interfaces";

describe('Budget model statistics', () => {

    it('Totals by category', () => {
        const info = createBudget({currency: 'USD', total: 12000}, 60);
        const expense1 = createExpense('1', info);
        const expense2 = {
            ...expense1, 
            identifier: '2'};
        const expense3 = {
            ...expense2,
            identifier: '3',
            categoryId: 'Category 3'
        };
        const bm = new BudgetModelImpl(
            info, 
            {
                '1': expense1,
                '2': expense2,
                '3': expense3
            });
        
        let totalsByCategory = getTotalsByCategory(bm);

        expect(totalsByCategory.getSubtotal(['Category', ]))
            .toBe(expense1.amountBaseCurrency + expense2.amountBaseCurrency);
        expect(totalsByCategory.getSubtotal([expense3.categoryId, ]))
            .toBe(expense3.amountBaseCurrency);
        
        const expense4 = {
            ...expense3,
            identifier: '4',
        };
        bm.setExpense(expense4);
        totalsByCategory = getTotalsByCategory(bm);
        expect(totalsByCategory.getSubtotal([expense3.categoryId, ]))
            .toBe(expense3.amountBaseCurrency + expense4.amountBaseCurrency);

        expense1.categoryId = expense1.categoryId + ' new';
        bm.setExpense(expense1);
        totalsByCategory = getTotalsByCategory(bm);
        expect(totalsByCategory.getSubtotal([expense1.categoryId, ]))
            .toBe(expense1.amountBaseCurrency);
        expect(totalsByCategory.getSubtotal([expense2.categoryId, ]))
            .toBe(expense2.amountBaseCurrency);
        expect(totalsByCategory.getSubtotal([expense3.categoryId, ]))
            .toBe(expense3.amountBaseCurrency + expense4.amountBaseCurrency);

        expense1.categoryId = expense2.categoryId = expense3.categoryId = expense4.categoryId;
        bm.setExpense(expense1);
        bm.setExpense(expense2);
        bm.setExpense(expense3);
        bm.setExpense(expense4);

        totalsByCategory = getTotalsByCategory(bm);

        expect(totalsByCategory.getSubtotal([expense1.categoryId, ]))
            .toBe(
                expense1.amountBaseCurrency + 
                expense2.amountBaseCurrency + 
                expense3.amountBaseCurrency + 
                expense4.amountBaseCurrency);

        bm.deleteExpense(expense1.identifier);
        bm.deleteExpense(expense4.identifier);
        totalsByCategory = getTotalsByCategory(bm);
        expect(totalsByCategory.getSubtotal([expense2.categoryId, ]))
            .toBe(
                expense2.amountBaseCurrency + 
                expense3.amountBaseCurrency);
    });

    it('Totals by country', () => {
        const info = createBudget({currency: 'USD', total: 12000}, 60);
        const expense1 = createExpense('1', info);
        const expense2 = {
            ...expense1, 
            identifier: '2'};
        const expense3 = {
            ...expense2,
            identifier: '3',
            countryCode: 'AA'
        };
        const bm = new BudgetModelImpl(
            info, 
            {
                '1': expense1,
                '2': expense2,
                '3': expense3
            });

        let totalsByCountry = getTotalsByCountry(bm);

        expect(totalsByCountry.getSubtotal([expense1.countryCode, ]))
            .toBe(expense1.amountBaseCurrency + expense2.amountBaseCurrency);
        expect(totalsByCountry.getSubtotal([expense3.countryCode, ]))
            .toBe(expense3.amountBaseCurrency);
        
        const expense4 = {
            ...expense3,
            identifier: '4',
        };
        bm.setExpense(expense4);
        totalsByCountry = getTotalsByCountry(bm);
        expect(totalsByCountry.getSubtotal([expense3.countryCode, ]))
            .toBe(expense3.amountBaseCurrency + expense4.amountBaseCurrency);

        expense1.countryCode = 'OO';
        bm.setExpense(expense1);
        totalsByCountry = getTotalsByCountry(bm);
        expect(totalsByCountry.getSubtotal([expense1.countryCode, ]))
            .toBe(expense1.amountBaseCurrency);
        expect(totalsByCountry.getSubtotal([expense2.countryCode, ]))
            .toBe(expense2.amountBaseCurrency);
        expect(totalsByCountry.getSubtotal([expense3.countryCode, ]))
            .toBe(expense3.amountBaseCurrency + expense4.amountBaseCurrency);

        expense1.countryCode = expense2.countryCode = expense3.countryCode = expense4.countryCode;
        bm.setExpense(expense1);
        bm.setExpense(expense2);
        bm.setExpense(expense3);
        bm.setExpense(expense4);
        totalsByCountry = getTotalsByCountry(bm);
        expect(totalsByCountry.getSubtotal([expense1.countryCode, ]))
            .toBe(
                expense1.amountBaseCurrency + 
                expense2.amountBaseCurrency + 
                expense3.amountBaseCurrency + 
                expense4.amountBaseCurrency);

        bm.deleteExpense(expense1.identifier);
        bm.deleteExpense(expense4.identifier);
        totalsByCountry = getTotalsByCountry(bm);
        expect(totalsByCountry.getSubtotal([expense2.countryCode, ]))
            .toBe(
                expense2.amountBaseCurrency + 
                expense3.amountBaseCurrency);

        bm.setExpense({...expense1, identifier: '5', when: new DateDay().addDays(1).timeMs});
        expect(totalsByCountry.getSubtotal([expense2.countryCode, ]))
        .toBe(
            expense2.amountBaseCurrency + 
            expense3.amountBaseCurrency);
    });

    describe('Number of days in a country', () => { 
        it('2 countries in same day', () => {
            const info = createBudget({currency: 'USD', total: 12000}, 60);
            const expense1 = createExpense('1', info);
            const expense2 = {
                ...expense1, 
                identifier: '2', 
                countryCode: 'FR'
            };
            const bm = new BudgetModelImpl(
                info, 
                {
                    '1': expense1,
                    '2': expense2,
                });
            const totalDaysByCountry = getTotalDaysByCountry(bm);
            expect(totalDaysByCountry).toStrictEqual({'ES': 1, 'FR': 1});
        });
    
        it('ES in 3 days, LU in 2 days', () => {
            const info = createBudget({currency: 'USD', total: 12000}, 60);
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
            const bm = new BudgetModelImpl(
                info, 
                {
                    '1': expense1,
                    '2': expense2,
                    '3': expense3,
                    '4': expense4,
                    '5': expense5,
                });
            const totalDaysByCountry = getTotalDaysByCountry(bm);
            expect(totalDaysByCountry).toStrictEqual(
                {'ES': 3, 'LU': 2}
            );
        });

        it('Ignores expenses in future', () => {
            const info = createBudget({currency: 'USD', total: 12000}, 60);
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
            const bm = new BudgetModelImpl(
                info, 
                {
                    '1': expense1,
                    '2': expense2,
                    '3': expense3,
                    '4': expense4,
                    '5': expense5,
                });

            const totalDaysByCountry = getTotalDaysByCountry(bm);
            expect(totalDaysByCountry).toStrictEqual(
                {'ES': 2, 'LU': 1}
            );
        });
    });
});
