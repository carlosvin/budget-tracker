import * as React from "react";
import List from '@material-ui/core/List';
import { ListItem, ListItemText  } from "@material-ui/core";
import { RouterProps, Route, RouteComponentProps } from "react-router";
import { BudgetView } from "./Budget";

const TMP = {budgets: [
    {name: 'A', identifier: 'a'}, 
    {name: 'B', identifier: 'b'}]};

interface BudgetListProps extends RouteComponentProps {
    budgets: BudgetProps[];
}

export class BudgetList extends React.PureComponent<BudgetListProps> {

    render(){
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

    get elements() {
        return this.props.budgets && this.props.budgets.map(budget => <BudgetItem key={budget.identifier} {...budget} />);
    }
}

interface BudgetProps {
    name: string;
    identifier: string;
}

class BudgetItem extends React.PureComponent<BudgetProps> {
    render(){
        return <ListItem 
            button 
            component="a" 
            href={this.props.identifier}>
            <ListItemText primary={this.props.name} />
        </ListItem>;
    }
}