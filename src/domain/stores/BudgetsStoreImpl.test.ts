import { BudgetsStoreImpl } from "./BudgetsStoreImpl";
import { BudgetModelImpl } from "../BudgetModelImpl";
import { createBudget } from "../../__mocks__/createBudget";
import { createBudgetTrackerMock } from "../../__mocks__/budgetTracker";
import { createExpense } from "../../__mocks__/createExpense";
import { Categories } from "../../interfaces";
import { addExpenseToGroups } from "../../__mocks__/addExpenseToGroups";
import { ExpenseModel } from "../ExpenseModel";


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
        const observedInfo = await store.getBudgetInfo(budgetInfo.identifier);
        expect(observedInfo).toStrictEqual(budgetInfo);
        const observedModel = await store.getBudgetModel(budgetInfo.identifier);
        expect(observedModel).toStrictEqual(new BudgetModelImpl(budgetInfo));
    });

    it('Split expenses', async () => {

        const budgetInfo = createBudget();
        btApp.storage.getBudget.mockReturnValue(budgetInfo);
        btApp.getCategoriesStore.mockReturnValue({ 
            getCategories: () => ([]),
            setCategories: (categories: Categories) => {}
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
        const expectedGroups = {};
        expectedDates.forEach(
            dateDay => addExpenseToGroups(
                expectedGroups, 
                new ExpenseModel({...splitExpense, when: dateDay.timeMs})));

        const bm = await store.getBudgetModel(budgetInfo.identifier);
        expect(expectedGroups).toStrictEqual(bm.expenseGroups);

        const observedByDay = expectedDates.map(d => bm.getTotalExpensesByDay(d.year, d.month, d.day));
        expect(observedByDay).toStrictEqual([1,1,1,1]);
    });

    it('Export data directly loaded from local storage', async () => {
        
        btApp.getCategoriesStore.mockReturnValue({ 
            getCategories: () => ([]),
            setCategories: (categories: Categories) => {}
        });
        const budgetInfo = createBudget();
        const budgets = {[budgetInfo.identifier]: budgetInfo};
        const expenses = {
            '1': createExpense('1', budgetInfo), 
            '2': createExpense('2', budgetInfo)
        };
        btApp.storage.getBudgets.mockReturnValue(budgets);
        btApp.storage.getBudget.mockReturnValue(budgetInfo);
        btApp.storage.getExpenses.mockReturnValue(expenses);

        const exported = await store.export();
        expect(exported.budgets).toStrictEqual(budgets);
        expect(exported.expenses).toStrictEqual(expenses);
    });
});
