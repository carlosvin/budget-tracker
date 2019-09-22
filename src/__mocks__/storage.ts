export function createStorageMock() {
    return {
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
}