import * as React from "react";
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { Route, RouteComponentProps } from "react-router";
import { BudgetView } from './Budget';
import { budgetsStore } from '../BudgetsStore';
import { Budget } from "../interfaces";
import { dateDiff } from "../utils";

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
            return <List>
                {this.elements}
                <Route path={`${this.props.match.path}/:id`} component={BudgetView} />
                <Route
                    exact
                    path={this.props.match.path}
                    render={() => <h3>Please select a topic.</h3>}
                />
                </List>;
        }
        return <p>Loading...</p>;
    }

    get elements() {
        return this.state.budgets 
            && this.state.budgets.map(
                budget => <BudgeListItem key={budget.identifier} {...budget} />);
    }
}

interface BudgetProps extends Budget {}

class BudgeListItem extends React.PureComponent<BudgetProps> {
    render(){
        return <ListItem 
            button 
            component="a" 
            href={`/budgets/${this.props.identifier}`}>
            <ListItemText 
                primary={this.props.name} 
                secondary={ `${this.days} days` }
                />
        </ListItem>;
    }

    get days () {
        return dateDiff(this.props.to, this.props.from);
    }
}