import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router";
import { BudgetList } from "./views/budgets/BudgetList";
import { About } from "./views/About";
import { BudgetEdit } from "./views/budgets/BudgetEdit";
import { BudgetView } from "./views/budgets/Budget";
import { ExpenseView } from "./views/expenses/Expense";
import { CategoryList } from "./views/categories/CategoryList";
import { AddCategory } from "./views/categories/AddCategory";
import { EditCategory } from "./views/categories/EditCategory";
import { Import } from "./views/budgets/Import";
import { TitleNotifierProps } from "./interfaces";

export class Routes extends React.PureComponent<TitleNotifierProps> {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={BudgetList} />
                <Route path="/about" render={this._render(About)} />
                <Route exact path="/budgets" render={this._render(BudgetList)} />
                <Route exact path='/budgets/import' render={this._render(Import)} />
                <Route exact path='/budgets/add' render={this._render(BudgetEdit)} />
                <Route exact path='/budgets/:budgetId/edit' render={this._render(BudgetEdit)} />
                <Route exact path='/budgets/:budgetId' render={this._render(BudgetView)} />
                <Route exact path='/budgets/:budgetId/expenses/add' render={this._render(ExpenseView)} />
                <Route exact path='/budgets/:budgetId/expenses/:expenseId' render={this._render(ExpenseView)} />
                <Route exact path='/categories' render={this._render(CategoryList)} />
                <Route exact path='/categories/add' render={this._render(AddCategory)} />
                <Route exact path='/categories/:name' render={this._render(EditCategory)} />
            </Switch>);
    }

    // Function to inject properties to components rendered by router
    // eslint-disable-next-line
    private _render = (ComponentType: React.ComponentType<any>) => (
        // eslint-disable-next-line
        (props: RouteComponentProps<any>) => <ComponentType {...props} {...this.props}/>
    );

}
