import * as React from "react";
import List from '@material-ui/core/List';
import { RouteComponentProps } from "react-router";
import { budgetsStore } from '../../stores/BudgetsStore';
import { Budget } from "../../interfaces";
import { BudgetListItem } from "../../components/BudgetListItem";
import { AddButton, ImportExportButton } from "../../components/buttons";
import { BudgetUrl } from "../../utils";
import { HeaderNotifierProps } from "../../routes";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

interface BudgetListProps extends RouteComponentProps, HeaderNotifierProps {}

interface BudgetListState {
    budgets: Budget[];
    loading: boolean;
}

export default class BudgetList extends React.PureComponent<BudgetListProps, BudgetListState> {

    constructor(props: BudgetListProps){
        super(props);
        this.state = {
            budgets: [], 
            loading: true
        };
    }

    async componentDidMount(){
        this.props.onTitleChange('Budget list');
        this.props.onActions(
            <React.Fragment>
                <AddButton href={BudgetUrl.add}/>
                <ImportExportButton href='/import'/>
            </React.Fragment>
        );
        const budgetsIndex = await budgetsStore.getBudgetsIndex();

        this.setState({ 
            budgets: Object.values(budgetsIndex),
            loading: false
        });
    }

    componentWillUnmount(){
        this.props.onActions([]);
    }
    
    render() {
        if (this.state.loading) {
            return null;
        }
        if (this.hasBudgets) {
            return (
                <List>
                    {this.elements}
                </List>);
        } else {
            return <Card>
                <CardContent>
                    There are no budgets, please add one.
                </CardContent>
            </Card>;
        }
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
