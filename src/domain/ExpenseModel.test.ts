import { ExpenseModel } from "./ExpenseModel";
import { uuid } from "./utils/uuid";
import { Expense } from "../api";

function createExpense (id: string,  when = new Date(2019, 0, 1).getTime()): Expense {
    return {
        amount: 100,
        amountBaseCurrency: 10,
        categoryId: 'Category',
        countryCode: 'ES',
        currency: 'USD',
        description: 'whatever description',
        identifier: id,
        when,
        budgetId: uuid(),
        splitInDays: 1
    };
}

describe('Expense Model', () => {

    it('Invalid input', () => {
        const invalid = {
            amount: 1, 
            amountBaseCurrency: 1,
            categoryId: '',
            countryCode: '',
            currency: '',
            description: '',
            identifier: '123', 
            when: 0,
            budgetId: '1',
            splitInDays: 1
        };

        expect(() => new ExpenseModel(invalid))
            .toThrow('Invalid expense (123) fields: country code, currency code');

        expect(() => new ExpenseModel({...invalid, countryCode: 'es'}))
            .toThrow('Invalid expense (123) fields: currency code');
        
        expect(() => new ExpenseModel({...invalid, identifier: '11', currency: 'ASD'}))
            .toThrow('Invalid expense (11) fields: country code');
        
    });

    it('Info', () => {
        const expenseInfo = createExpense('Expense identifier');
        const expenseModel = new ExpenseModel(expenseInfo);
        expect(expenseModel.info).toStrictEqual(expenseInfo);
    });

    it('Sum of expenses', () => {
        const values = [];
        const numberOfExpenses = Math.random() * 1000;
        let expectedTotal = 0;
        for (let i=0; i<numberOfExpenses; i++) {
            const mult = Math.random() ? -100000 : 100000;
            const value = Math.random() * mult;       
            values.push(value);
            expectedTotal += value;
        }
        const baseExpense = createExpense('1');
        const expenses = values.map(
            v => ({
                ...baseExpense,
                identifier: `${v}`, 
                amountBaseCurrency: v, 
                amount: v * 10}));
        expect(ExpenseModel.sum(expenses)).toBe(expectedTotal);
    });

    describe('Split', () => {

        const info = {
            ...createExpense('1'),
            amount: 99, 
            amountBaseCurrency: 990
        };

        it('splits in 0 days should be fixed to 1 day', () => {
            const em = new ExpenseModel({...info, splitInDays: 0});
            expect(em.splitInDays).toBe(1);
        });

        it('splits in 1 day', () => {
            const expense = new ExpenseModel({...info, splitInDays: 1});
            expect(expense.split()).toStrictEqual([expense]);
        });

        it('splits in 3 days', () => {
            const expense = new ExpenseModel({...info, splitInDays: 3});

            expect(expense.split()).toStrictEqual([
                new ExpenseModel({...expense, 
                    amount: 33,
                    amountBaseCurrency: 330}),
                new ExpenseModel({
                    ...expense, 
                    amount: 33,
                    amountBaseCurrency: 330, 
                    when: new Date(2019, 0, 2).getTime()}),
                new ExpenseModel({
                    ...expense, 
                    amount: 33, 
                    amountBaseCurrency: 330, 
                    when: new Date(2019, 0, 3).getTime()}),
            ]);
        });
        
    });


});
