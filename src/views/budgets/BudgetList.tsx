import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";
import { RouteComponentProps, Redirect } from "react-router";
import { budgetsStore } from '../../stores/BudgetsStore';
import { Budget } from "../../interfaces";
import { BudgetListItem } from "./BudgetListItem";
import { AddButton, ImportButton} from "../buttons";
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
                        <Grid justify='space-between' container>
                            <AddButton href={BudgetUrl.add}/>
                            <ImportButton href={BudgetUrl.import}/>
                        </Grid>
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
