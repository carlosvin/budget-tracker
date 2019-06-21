import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps, Redirect } from "react-router";
import { budgetsStore } from '../../stores/BudgetsStore';
import { Budget } from "../../interfaces";
import { BudgetListItem } from "../../components/BudgetListItem";
import { AddButton } from "../../components/buttons";
import { BudgetUrl } from "../../utils";
import { HeaderNotifierProps } from "../../routes";

interface BudgetListProps extends RouteComponentProps, HeaderNotifierProps {}

interface BudgetListState {
    budgets: Budget[];
}

export default class BudgetList extends React.PureComponent<BudgetListProps, BudgetListState> {

    constructor(props: BudgetListProps){
        super(props);
        this.state = {
            budgets: Object.values(budgetsStore.budgetIndex)
        };
    }

    componentDidMount(){
        this.props.onTitleChange('Budget list');
        this.props.onActions(
            <React.Fragment>
                <AddButton href={BudgetUrl.add}/>
            </React.Fragment>
        );
    }

    componentWillUnmount(){
        this.props.onActions([]);
    }
    
    render() {
        if (this.state) {
            if (this.hasBudgets) {
                return (
                    <List>
                        {this.elements}
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
