import { ExpenseModel } from "./ExpenseModel";

function createExpense (id: string,  when = new Date('2019/1/1').getTime()) {
    return {
        amount: 100,
        amountBaseCurrency: 10,
        categoryId: 'Category',
        countryCode: 'ES',
        currency: 'USD',
        description: 'whatever description',
        identifier: id,
        when
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
            when: 0
        };

        expect(() => new ExpenseModel(invalid))
            .toThrow('Invalid expense (123) fields: country code, currency code');

        expect(() => new ExpenseModel({...invalid, countryCode: 'es'}))
            .toThrow('Invalid expense (123) fields: currency code');
        
        expect(() => new ExpenseModel({...invalid, identifier: '11', currency: 'ASD'}))
            .toThrow('Invalid expense (11) fields: country code');
        
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

        const expense: ExpenseModel = new ExpenseModel({
            amount: 99,
            amountBaseCurrency: 990,
            categoryId: 'General',
            countryCode: 'ES',
            currency: 'EUR',
            identifier: 'original id',
            when: new Date('2019/1/1').getTime()
        });

        it('splits in 0 days', () => {
            expect(() => (expense.split(0)))
                .toThrow('You cannot split an expense in less than one piece');
        });

        it('splits in 1 day', () => {
            expect(expense.split(1)).toStrictEqual([expense]);
        });

        it('splits in 3 days', () => {
            expect(expense.split(3, () => 'randomID')).toStrictEqual([
                {...expense, amount: 33, amountBaseCurrency: 330},
                {...expense, amount: 33, amountBaseCurrency: 330, 
                    identifier: 'randomID', when: new Date('2019/1/2').getTime()},
                {...expense, amount: 33, amountBaseCurrency: 330, 
                    identifier: 'randomID', when: new Date('2019/1/3').getTime()},
            ]);

        });
        
    });


});
