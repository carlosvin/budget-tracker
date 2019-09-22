import { createStorageMock } from "./storage";

export function createBudgetTrackerMock () {
    return {
            storage: createStorageMock(),
            getAuth: jest.fn(),
            getBudgetsStore: jest.fn(),
            getCategoriesStore: jest.fn(),
            getIconsStore: jest.fn(),
            getCurrenciesStore: jest.fn(),
            getCountriesStore: jest.fn(),
        };
}
