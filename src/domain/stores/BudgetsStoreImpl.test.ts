import { BudgetsStoreImpl } from "./BudgetsStoreImpl";
import { BudgetModelImpl } from "../BudgetModelImpl";
import { createBudget } from "../../__mocks__/createBudget";
import { createBudgetTrackerMock } from "../../__mocks__/budgetTracker";
import { createExpense } from "../../__mocks__/createExpense";
import { Categories } from "../../interfaces";


describe('Budget Model Creation', () => {

    it('Set first budget', async () => {
        // TODO move 2 next lines to before each execution
        const btApp = createBudgetTrackerMock();
        const store = new BudgetsStoreImpl(btApp);

        const budgetInfo = createBudget();
        btApp.storage.getBudget.mockReturnValue(budgetInfo);

        await store.setBudget(budgetInfo);
        const observedInfo = await store.getBudgetInfo(budgetInfo.identifier);
        expect(observedInfo).toStrictEqual(budgetInfo);
        const observedModel = await store.getBudgetModel(budgetInfo.identifier);
        expect(observedModel).toStrictEqual(new BudgetModelImpl(budgetInfo));
    });

    it('Split expenses', async () => {
        // TODO move 2 next lines to before each execution
        const btApp = createBudgetTrackerMock();
        const store = new BudgetsStoreImpl(btApp);

        const budgetInfo = createBudget();
        btApp.storage.getBudget.mockReturnValue(budgetInfo);
        btApp.getCategoriesStore.mockReturnValue({ 
            getCategories: () => ([]),
            setCategories: (categories: Categories) => {}
        });

        await store.setBudget(budgetInfo);

        const expense = {...createExpense('1', budgetInfo), amount: 40, amountBaseCurrency: 4};
        await store.setExpenses(budgetInfo.identifier, [expense]);
        const bm = await store.getBudgetModel(budgetInfo.identifier);
        const em = await bm.getExpense(expense.identifier);
        const expectedDates = [em.date, 
            em.date.clone().addDays(1),
            em.date.clone().addDays(2),
            em.date.clone().addDays(3),
        ];

        const expensesSplit = em.split(4);
        expect(expensesSplit.map(em => em.date)).toStrictEqual(expectedDates);

        await store.setExpenses(bm.identifier, expensesSplit);
        const observedExpenses = await store.getExpenses(bm.identifier);

        expect(Object
            .values(observedExpenses)
            .map(e => e.when))
            .toStrictEqual(expectedDates.map(d=>d.timeMs));

        const exported = await store.export();
        expect(Object.values(exported.expenses).map(e => e.when)).toStrictEqual(expectedDates.map(d=>d.timeMs));

        await Promise.all(Object.keys(observedExpenses).map(id => store.deleteExpense(budgetInfo.identifier, id )));

        await store.import(exported);
        
        const exportedObserved = await store.export();
        expect(exportedObserved.budgets).toStrictEqual(exported.budgets);
        expect(exportedObserved.expenses).toStrictEqual(exported.expenses);
    });

});
