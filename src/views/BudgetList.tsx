import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router";
import { budgetsStore } from '../BudgetsStore';
import { Budget } from "../interfaces";
import { BudgetListItem } from "./BudgetListItem";

interface BudgetListProps extends RouteComponentProps {}

interface BudgetListState {
    budgets: Budget[];
}

export class BudgetList extends React.PureComponent<BudgetListProps, BudgetListState> {

    constructor(props: BudgetListProps){
        super(props);
        this.initBudgets();
    }

    private async initBudgets () {
        try {
            const budgets = await budgetsStore.getBudgets();
            this.setState({budgets});
        } catch(e) {
            console.error(e);
        }
    }

    render() {
        if (this.state) {
            return (
            <List>
                {this.elements}
            </List>);
        }
        return <CircularProgress/>;
    }

    get elements() {
        return this.state.budgets 
            && this.state.budgets.map(
                budget => <BudgetListItem key={budget.identifier} {...budget} />);
    }
}
