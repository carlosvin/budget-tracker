import { BudgetModel, DAY_MS } from "./BudgetModel";
import { uuid } from "./utils";
import { Expense } from "./interfaces";

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

function createExpense () {
    return {
        amount: 100,
        amountBaseCurrency: 98,
        categoryId: 'Category',
        countryCode: 'ES',
        currency: 'USD',
        description: 'whatever description',
        identifier: '1',
        when: new Date().getTime()
    };
}

it('Budget model, expense group creation', async () => {
    const expense1A = createExpense();
    const expense2A = {...expense1A, when: expense1A.when - 100000};
    const expense3B = {...expense1A, when: expense1A.when + DAY_MS};
    expect(BudgetModel.getGroup(expense1A)).toBe(BudgetModel.getGroup(expense2A));
    expect(BudgetModel.getGroup(expense1A)).not.toBe(BudgetModel.getGroup(expense3B));
});

it('Budget model creation without expenses', async () => {
    const bm = new BudgetModel(createBudget('EUR', 30, 1000), {});
    expect(await bm.getTotalExpenses()).toBe(0);
    expect(bm.expectedDailyExpensesAverage).toBe(33);
    expect(bm.expensesGroupedByDate).toBe(undefined);
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

