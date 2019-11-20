import React from 'react';
import List from '@material-ui/core/List';
import { Budget } from '../../api';
import { BudgetListItem } from './BudgetListItem';

interface BudgetsListProps {
    budgets: Budget[];
    selected: Set<string>;
    onSelected: (selected: Set<string>) => void;
}

export function BudgetsList({budgets, selected, onSelected}: BudgetsListProps) {
    const showCheckbox = budgets.length > 1;
    
    function handleChanged (identifier: string, checked: boolean) {
        if (checked) {
            selected.add(identifier);
        } else {
            selected.delete(identifier);
        }
        onSelected(new Set(selected));
    }

    return <List>{ 
        budgets.sort(b => -b.to).map(
            budget => <BudgetListItem 
                showCheckbox={showCheckbox}
                key={`list-item-${budget.identifier}`} {...budget} 
                onChanged={handleChanged} 
                checked={selected.has(budget.identifier)}/>)}
    </List>;
}
