import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps, Redirect } from "react-router";
import { budgetsStore } from '../../stores/BudgetsStore';
import { Budget } from "../../interfaces";
import { BudgetListItem } from "./BudgetListItem";
import { AddButton } from "../buttons";
import { BudgetUrl } from "../../utils";

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
            if (this.hasBudgets) {
                return (
                    <List>
                        {this.elements}
                        <AddButton href={BudgetUrl.add}/>
                    </List>); 
            } else {
                return <Redirect to={BudgetUrl.add}/>;
            }
        }
        return <CircularProgress/>;
    }

    get hasBudgets(){
        return this.state.budgets.length > 0;
    }

    get elements() {
        return this.state.budgets 
            && this.state.budgets.map(
                budget => <BudgetListItem key={budget.identifier} {...budget} />);
    }
}
