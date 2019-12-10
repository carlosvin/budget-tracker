import { useState, useEffect } from 'react';
import { BudgetModel } from '../domain/BudgetModel';
import { useBudgetsStore } from './useBudgetsStore';
import { BudgetsStore } from '../domain/stores';

export function useBudgetModel(budgetId: string) {
    const store = useBudgetsStore();
    const [budgetModel, setBudgetModel] = useState<BudgetModel>();

    useEffect(() => {
        async function fetchBudget (store: BudgetsStore) {
            setBudgetModel(await store.getBudgetModel(budgetId));
        }
        if (budgetId) {
            let isSubscribed = true;

            if (isSubscribed) {
                if (store) {
                    fetchBudget(store);
                } else {
                    setBudgetModel(undefined);
                }
            }
            return () => {isSubscribed = false};
        }
        
    }, [budgetId, store]);

    return budgetModel;
}