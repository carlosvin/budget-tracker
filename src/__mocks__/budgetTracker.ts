import { createStorageMock } from "./storage";
import { BudgetTracker } from "../api";

export function createBudgetTrackerMock (): BudgetTracker {
    return {
            storage: createStorageMock(),
            localization: { get: (k) => (k), lang: 'test'},
            getAuth: jest.fn(),
            getBudgetsStore: jest.fn(),
            getCategoriesStore: jest.fn(),
            getIconsStore: jest.fn(),
            getCurrenciesStore: jest.fn(),
            getCountriesStore: jest.fn(),
        };
}
