import { BudgetsStoreImpl } from "./BudgetsStoreImpl";
import { BudgetModelImpl } from "../BudgetModelImpl";
import { createBudget } from "../../__tests__/createBudget";

describe('Budget Model Creation', () => {
    const storageMock = {
        
        addObserver: jest.fn(),
        deleteBudget: jest.fn(),
        deleteCategory: jest.fn(),
        deleteExpense: jest.fn(),
        deleteObserver: jest.fn(),
        getBudget: jest.fn(),
        getBudgets: jest.fn(),
        getCategories: jest.fn(),
        getCategory: jest.fn(),
        getExpense: jest.fn(),
        getExpenses: jest.fn(),
        setBudget: jest.fn(),
        setCategories: jest.fn(),
        setExpenses: jest.fn(),
        setRemote: jest.fn()
    };
    const store = new BudgetsStoreImpl(storageMock);

    it('Set first budget', async () => {
        
        const budgetInfo = createBudget();
        storageMock.getBudget.mockReturnValue(budgetInfo);

        await store.setBudget(budgetInfo);
        const observedInfo = await store.getBudgetInfo(budgetInfo.identifier);
        expect(observedInfo).toStrictEqual(budgetInfo);
        const observedModel = await store.getBudgetModel(budgetInfo.identifier);
        expect(observedModel).toStrictEqual(new BudgetModelImpl(budgetInfo));
        
    });

});
