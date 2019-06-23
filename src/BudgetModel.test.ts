import { BudgetModel, DAY_MS } from "./BudgetModel";
import { uuid } from "./utils";
import { Expense } from "./interfaces";
import { currenciesStore } from "./stores/CurrenciesStore";

jest.mock('./stores/CurrenciesStore');
const mockedCurrenciesStore: jest.Mocked<typeof currenciesStore> = currenciesStore as any;

function createBudget (currency: string, days: number, total: number) {
    return { 
        currency: currency,
        from: new Date().getTime(),
        to: new Date().getTime() + (DAY_MS * days),
        identifier: uuid(),
        name: 'Test',
        total: total
    };
}

function createExpense (id: string) {
    return {
        amount: 100,
        amountBaseCurrency: 98,
        categoryId: 'Category',
        countryCode: 'ES',
        currency: 'USD',
        description: 'whatever description',
        identifier: id,
        when: new Date().getTime()
    };
}

it('Budget model, expense group creation', async () => {
    const expense1A = createExpense('1');
    const expense2A = {...expense1A, identifier: '2', when: expense1A.when - 100000};
    const expense3B = {...expense1A, identifier: '3',  when: expense1A.when + DAY_MS};
    expect(BudgetModel.getGroup(expense1A)).toBe(BudgetModel.getGroup(expense2A));
    expect(BudgetModel.getGroup(expense1A)).not.toBe(BudgetModel.getGroup(expense3B));
});


it('Expense group creation with fixed dates', () => {
    const groupA = new Date(2019, 11, 31);
    const groupB = new Date(1982, 1, 26);
    const groupC = new Date(2019, 11, 30);

    const baseExpense = createExpense('1');
    const expense1A = {...baseExpense, when: groupA.getTime()};
    const expense2B = {...baseExpense, when: groupB.getTime()};
    const expense3C = {...baseExpense, when: groupC.getTime()};

    expect(BudgetModel.getGroup(expense1A)-groupA.getTime()).toBe(0);
    expect(BudgetModel.getGroup(expense1A)).toBe(groupA.getTime());
    expect(BudgetModel.getGroup(expense2B)).toBe(groupB.getTime());
    expect(BudgetModel.getGroup(expense3C)).toBe(groupC.getTime());
});

it('Budget model creation without expenses', async () => {
    const bm = new BudgetModel(createBudget('EUR', 30, 1000), {});
    expect(await bm.getTotalExpenses()).toBe(0);
    expect(bm.expectedDailyExpensesAverage).toBe(33);
    expect(bm.expensesGroupedByDate).toStrictEqual({});
    expect(await bm.getAverage()).toBe(0);
    expect(bm.getExpense('whatever')).toBe(undefined);
    expect(await bm.getTotalExpenses()).toBe(0);
    expect(bm.numberOfExpenses).toBe(0);
    expect(bm.days).toBe(1);
    expect(bm.totalDays).toBe(30);
});


it('Budget model creation, no expenses, added them later', async () => {
    const budget = createBudget('EUR', 30, 1000);
    const bm = new BudgetModel(budget, {});
    const expense1: Expense = {
        amount: 100,
        amountBaseCurrency: 98,
        categoryId: 'Category',
        countryCode: 'ES',
        currency: 'USD',
        description: 'whatever description',
        identifier: '1',
        when: new Date().getTime()
    };
    const expense2 = {...expense1,
        amount: 2,
        amountBaseCurrency: 2,
        currency: 'EUR',
        when: (expense1.when + (DAY_MS * 2)),
        identifier: '2',
    };
    bm.setExpense(expense1);
    bm.setExpense(expense2);

    expect(bm.expensesGroupedByDate).toStrictEqual({
        [BudgetModel.getGroup(expense1)]: { 
            [expense1.identifier]: expense1
        },
        [BudgetModel.getGroup(expense2)]: {
            [expense2.identifier]: expense2 
        },
    });

    expect(await bm.getTotalExpenses()).toBe(98);
    expect(bm.expectedDailyExpensesAverage).toBe(33);

    expect(await bm.getAverage()).toBe(98);
    expect(bm.getExpense(expense1.identifier)).toBe(expense1);
    expect(bm.getExpense(expense2.identifier)).toBe(expense2);
    expect(await bm.getTotalExpenses()).toBe(98);
    expect(bm.numberOfExpenses).toBe(2);
    expect(bm.days).toBe(1);
    expect(bm.totalDays).toBe(30);

    const expense2Updated = {...expense2, when: new Date().getTime()};
    // change the date of the expense2 so it is added to calculations
    bm.setExpense(expense2Updated);
    expect(await bm.getAverage()).toBe(100);
    expect(await bm.getTotalExpenses()).toBe(100);

    // Modify budget dates to check that average is recalculated
    bm.setBudget({...budget, from: budget.from - DAY_MS});
    expect(bm.days).toBe(2);
    expect(bm.totalDays).toBe(31);
    expect(await bm.getAverage()).toBe(50);
    expect(await bm.getTotalExpenses()).toBe(100);
    expect(bm.getExpense('1')).toBe(expense1);
    expect(bm.getExpense('2')).toBe(expense2Updated);

    expect(bm.expensesGroupedByDate).toStrictEqual({
        [BudgetModel.getGroup(expense1)]: { 
            [expense1.identifier]: expense1 ,
            [expense2Updated.identifier]: expense2Updated }
    });
});

it('Remove expense', async () => {
    const expense1 = createExpense('1');
    const expense2 = {...expense1, identifier: '2'};
    const expense3 = {...expense1, identifier: '3', when: new Date().getTime() + DAY_MS * 3};
    const expense4 = {...expense1, identifier: '4', amountBaseCurrency: 55};
    const bm = new BudgetModel(
        createBudget('EUR', 30, 1000), 
        {
            '1': expense1,
            '2': expense2,
            '3': expense3,
            '4': expense4,
        });
    expect(await bm.getTotalExpenses()).toBe(
        expense1.amountBaseCurrency + 
        expense2.amountBaseCurrency + 
        expense4.amountBaseCurrency);

    expect(bm.deleteExpense('6')).toBe(false);
    expect(bm.deleteExpense('2')).toBe(true);
    expect(await bm.getTotalExpenses()).toBe(
        expense1.amountBaseCurrency + 
        expense4.amountBaseCurrency);
    
    expect(bm.deleteExpense('3')).toBe(true);
    expect(await bm.getTotalExpenses()).toBe(
        expense1.amountBaseCurrency + 
        expense4.amountBaseCurrency);
});


it('Modify expense amount', async () => {
    const expense1 = createExpense('1');
    const expense2 = {...expense1, identifier: '2'};
    const bm = new BudgetModel(
        createBudget('EUR', 30, 1000), 
        {
            '1': expense1,
            '2': expense2
        });

    const modifiedExpense2 = {
        ...expense2, 
        amountBaseCurrency: 10
    };
    bm.setExpense(modifiedExpense2);
    expect(await bm.getTotalExpenses()).toBe(
        expense1.amountBaseCurrency + 
        modifiedExpense2.amountBaseCurrency);
    expect(bm.getExpense('2').amountBaseCurrency)
        .toBe(modifiedExpense2.amountBaseCurrency);

    expect(bm.expensesGroupedByDate).toStrictEqual({
        [BudgetModel.getGroup(expense1)]: { 
            [expense1.identifier]: expense1,
            [modifiedExpense2.identifier]: modifiedExpense2 }
    });

    const modifiedExpense2Date = {
        ...expense2, 
        when: new Date().getTime() + DAY_MS * 10
    };
    bm.setExpense(modifiedExpense2Date);
    expect(await bm.getTotalExpenses()).toBe(expense1.amountBaseCurrency);
    expect(bm.getExpense('2').amountBaseCurrency)
        .toBe(modifiedExpense2Date.amountBaseCurrency);

    expect(bm.expensesGroupedByDate).toStrictEqual({
        [BudgetModel.getGroup(expense1)]: { 
            [expense1.identifier]: expense1,
        },
        [BudgetModel.getGroup(modifiedExpense2Date)]: { 
            [modifiedExpense2Date.identifier]: modifiedExpense2Date 
        },
    });

});

it('Check groups are created properly when model is initialized from constructor', async () => {
    const budget = createBudget('EUR', 30, 1000);
    const expense1: Expense = {
        amount: 100,
        amountBaseCurrency: 98,
        categoryId: 'Category',
        countryCode: 'ES',
        currency: 'USD',
        description: 'whatever description',
        identifier: '1',
        when: new Date().getTime()
    };
    const expense2 = {...expense1,
        amount: 2,
        amountBaseCurrency: 2,
        currency: 'EUR',
        when: (expense1.when + (DAY_MS * 2)),
        identifier: '2',
    };
    const bm = new BudgetModel(
        budget, 
        {
            [expense1.identifier]: expense1, 
            [expense2.identifier]: expense2, 
        });

    expect(bm.expensesGroupedByDate).toStrictEqual({
        [BudgetModel.getGroup(expense1)]: { 
            [expense1.identifier]: expense1
        },
        [BudgetModel.getGroup(expense2)]: {
            [expense2.identifier]: expense2 
        },
    });

    expect(await bm.getTotalExpenses()).toBe(98);
    expect(bm.expectedDailyExpensesAverage).toBe(33);

    expect(await bm.getAverage()).toBe(98);
    expect(bm.getExpense(expense1.identifier)).toBe(expense1);
    expect(bm.getExpense(expense2.identifier)).toBe(expense2);
    expect(await bm.getTotalExpenses()).toBe(98);
    expect(bm.numberOfExpenses).toBe(2);
    expect(bm.days).toBe(1);
    expect(bm.totalDays).toBe(30);

});

it('Modify budget base currency ', async () => {
    const info = createBudget('EUR', 30, 1000);
    const expense1 = {...createExpense('1'), currency: 'USD', amount: 10, amountBaseCurrency: 9};
    const expense2 = {...expense1, identifier: '2', currency: 'BTH', amount: 340, amountBaseCurrency: 10};
    const expense3 = {...expense1, identifier: '3', currency: 'EUR', amount: 1, amountBaseCurrency: 1};
    const bm = new BudgetModel(
        info, 
        {
            '1': expense1,
            '2': expense2,
            '3': expense3
        });

    mockedCurrenciesStore.getAmountInBaseCurrency.mockReturnValue(Promise.resolve(33));

    await bm.setBudget({...info, currency: 'USD'});

    expect(await bm.getTotalExpenses()).toBe(99);


});
