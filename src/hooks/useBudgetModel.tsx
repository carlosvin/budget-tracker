import { useState, useEffect } from 'react';
import { btApp } from '../BudgetTracker';
import { BudgetModel } from '../domain/BudgetModel';

export function useBudgetModel(budgetId: string) {
    // TODO add useBudgetsStore
    const [budgetModel, setBudgetModel] = useState<BudgetModel>();

    useEffect(() => {
        async function fetchBudget () {
            const store = await btApp.getBudgetsStore();
            setBudgetModel(await store.getBudgetModel(budgetId));
        }

        let isSubscribed = true;

        if (isSubscribed) {
            fetchBudget();
        }

        return () => {isSubscribed = false};
        
    }, [budgetId]);

    return budgetModel;
}