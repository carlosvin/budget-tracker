import { BudgetsStoreImpl } from "./BudgetsStoreImpl";
import { BudgetModelImpl } from "../BudgetModelImpl";
import { createBudget } from "../../__mocks__/createBudget";
import { createBudgetTrackerMock } from "../../__mocks__/budgetTracker";

describe('Budget Model Creation', () => {
    const btApp = createBudgetTrackerMock();

    it('Set first budget', async () => {
        const store = new BudgetsStoreImpl(btApp);
        
        const budgetInfo = createBudget();
        btApp.storage.getBudget.mockReturnValue(budgetInfo);

        await store.setBudget(budgetInfo);
        const observedInfo = await store.getBudgetInfo(budgetInfo.identifier);
        expect(observedInfo).toStrictEqual(budgetInfo);
        const observedModel = await store.getBudgetModel(budgetInfo.identifier);
        expect(observedModel).toStrictEqual(new BudgetModelImpl(budgetInfo));
        
    });

});
