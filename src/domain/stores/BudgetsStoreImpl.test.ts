import { BudgetsStoreImpl } from "./BudgetsStoreImpl";
import { BudgetModelImpl } from "../BudgetModelImpl";
import { createBudget } from "../../__mocks__/createBudget";
import { createBudgetTrackerMock } from "../../__mocks__/budgetTracker";
import { createExpense } from "../../__mocks__/createExpense";
import { CategoriesMap } from "../../api";
import { ExpenseModel } from "../ExpenseModel";
import { ExpensesYearMap } from "../ExpensesYearMap";


describe('Budget Model Creation', () => {
    let btApp = createBudgetTrackerMock();
    let store = new BudgetsStoreImpl(btApp);

    beforeEach(() => {
        btApp = createBudgetTrackerMock();
        store = new BudgetsStoreImpl(btApp);
    });

    it('Set first budget', async () => {

        const budgetInfo = createBudget();
        btApp.storage.getBudget.mockReturnValue(budgetInfo);

        await store.setBudget(budgetInfo);
        const observedModel = await store.getBudgetModel(budgetInfo.identifier);
        expect(observedModel).toStrictEqual(new BudgetModelImpl(budgetInfo));
    });

    it('Split expenses', async () => {

        const budgetInfo = createBudget();
        btApp.storage.getBudget.mockReturnValue(budgetInfo);
        btApp.getCategoriesStore.mockReturnValue({ 
            getCategories: () => ([]),
            setCategories: (categories: CategoriesMap) => {}
        });
        btApp.storage.getBudgets.mockReturnValue({[budgetInfo.identifier]: budgetInfo});


        await store.setBudget(budgetInfo);

        const expense = {
            ...createExpense('1', budgetInfo), 
            amount: 40, 
            amountBaseCurrency: 4, 
            splitInDays: 4};
        await store.setExpenses(budgetInfo.identifier, [expense]);

        const splitExpense = {...expense, amountBaseCurrency: 1, amount: 10, splitExpense: 1};
        const em = new ExpenseModel({...splitExpense});
        const expectedDates = [
            em.date.clone(),
            em.date.clone().addDays(1),
            em.date.clone().addDays(2),
            em.date.clone().addDays(3),
        ];
        const expectedGroups = new ExpensesYearMap();
        expectedDates.forEach(
            dateDay => expectedGroups.addExpense( 
                new ExpenseModel({...splitExpense, when: dateDay.timeMs})));

        const bm = await store.getBudgetModel(budgetInfo.identifier);
        expect(expectedGroups).toStrictEqual(bm.expenseGroupsIn);

        const observedByDay = expectedDates.map(d => bm.getTotalExpenses(d.year, d.month, d.day));
        expect(observedByDay).toStrictEqual([1,1,1,1]);
    });

    it('Export data directly loaded from local storage', async () => {
        
        btApp.getCategoriesStore.mockReturnValue({ 
            getCategories: () => ([]),
            setCategories: (categories: CategoriesMap) => {}
        });
        const budgetInfo = createBudget();
        const budgetInfo2 = createBudget({identifier: '2'});
        const budgets = {
            [budgetInfo.identifier]: budgetInfo,
            [budgetInfo2.identifier]: budgetInfo2
        };
        const expenses = [
            createExpense('1', budgetInfo), 
            createExpense('2', budgetInfo), 
            createExpense('3', budgetInfo2)];
        btApp.storage.getBudgets.mockReturnValue(budgets);
        btApp.storage.getBudget.mockImplementation((id: string) => budgets[id]);
        btApp.storage.getExpenses.mockReturnValue(expenses);

        const exported = await store.export();
        expect(exported.budgets).toStrictEqual(budgets);
        expect(Object.values(exported.expenses)).toStrictEqual(expenses);
    });

    it('Move expense from budget A to B', async () => {
        
        btApp.getCategoriesStore.mockReturnValue({ 
            getCategories: () => ([]),
            setCategories: (categories: CategoriesMap) => {}
        });
        const budgetInfo1 = createBudget({identifier: 'A'});
        const budgetInfo2 = createBudget({identifier: 'B'});
        const budgets = {
            [budgetInfo1.identifier]: budgetInfo1,
            [budgetInfo2.identifier]: budgetInfo2
        };
        const expenses = [
            createExpense('0', budgetInfo1), 
            createExpense('1', budgetInfo1), 
            createExpense('2', budgetInfo2)];
        btApp.storage.getBudgets.mockReturnValue(budgets);
        btApp.storage.getBudget.mockImplementation((id: string) => budgets[id]);
        btApp.storage.getExpenses.mockImplementation(
            (budgetId: string) => (expenses.filter(e => e.budgetId === budgetId)));
        btApp.storage.getExpense.mockImplementation(
            (expenseId: string) => (expenses.filter(e => e.identifier === expenseId)[0]));

        let bm1 = await store.getBudgetModel(budgetInfo1.identifier);
        let bm2 = await store.getBudgetModel(budgetInfo2.identifier);
        expect([...bm1.expenses].map(e => e.info)).toStrictEqual([expenses[0], expenses[1]]);
        expect([...bm2.expenses].map(e => e.info)).toStrictEqual([expenses[2]]);

        // move second expense to budget B
        await store.setExpenses(budgetInfo2.identifier, 
            [{...expenses[1], budgetId: budgetInfo2.identifier}]);
        expenses[1].budgetId = budgetInfo2.identifier;

        bm1 = await store.getBudgetModel(budgetInfo1.identifier);
        bm2 = await store.getBudgetModel(budgetInfo2.identifier);

        expect([...bm1.expenses].map(e => e.info)).toStrictEqual([expenses[0]]);
        expect([...bm2.expenses].map(e => e.info)).toStrictEqual([expenses[2], expenses[1]]);
    });

    
});
