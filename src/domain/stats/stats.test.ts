import { createBudget } from "../../__mocks__/createBudget";
import { createExpense } from "../../__mocks__/createExpense";
import { BudgetModelImpl } from "../BudgetModelImpl";
import { getTotalsByCategory } from "./getTotalsByCategory";
import { getTotalsByCountry } from "./getTotalsByCountry";
import { DateDay } from "../DateDay";
import { getTotalDaysByCountry } from "./getTotalDaysByCountry";
import { getAverageDailyExpensesPerCountry } from "./getAverageDailyExpensesPerCountry";

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

    it('Daily averages by country', () => {
        const info = createBudget({currency: 'USD', total: 12000}, 60);
        const baseExpense = createExpense('1', info);
        const today = DateDay.fromTimeMs(info.from);
        const expenses = {
            '1': {...baseExpense, amountBaseCurrency: 100, countryCode: 'ES'},
            '2': {...baseExpense, identifier: '2', amountBaseCurrency: 100, countryCode: 'ES'},
            '3': {...baseExpense, identifier: '3', amountBaseCurrency: 20, countryCode: 'ES', when: today.clone().addDays(1).timeMs},
            '4': {...baseExpense, identifier: '4', amountBaseCurrency: 50, countryCode: 'TH', when: today.timeMs},
            '5': {...baseExpense, identifier: '5', amountBaseCurrency: 10, countryCode: 'TH', when: today.clone().addDays(3).timeMs},
            '6': {...baseExpense, identifier: '6', amountBaseCurrency: 20, countryCode: 'TH', when: today.clone().addDays(4).timeMs},
        };
        const bm = new BudgetModelImpl(info, expenses);
        const dailyAverages = getAverageDailyExpensesPerCountry(bm);

        expect(dailyAverages).toStrictEqual({
            'ES': (100 + 100 + 20) / 2,
            'TH': (50 + 10 + 20) / 3
        });
    });

});
