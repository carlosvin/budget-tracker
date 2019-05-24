import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router";
import { TitleNotifierProps } from "./interfaces";

const routes = {
    BudgetView: React.lazy(() => import('./views/budgets/Budget')),
    BudgetList: React.lazy(() => import('./views/budgets/BudgetList')),
    BudgetEdit: React.lazy(() => import('./views/budgets/BudgetEdit')),
    BudgetImport: React.lazy(() => import('./views/budgets/Import')),
    ExpenseView: React.lazy(() => import('./views/expenses/Expense')),
    CategoryList: React.lazy(() => import('./views/categories/CategoryList')),
    AddCategory: React.lazy(() => import('./views/categories/AddCategory')),
    About: React.lazy(() => import('./views/About'))
};

export class Routes extends React.PureComponent<TitleNotifierProps> {
    render() {
        return (
            <Switch>
                <Route exact path="/budgets" render={this._render(routes.BudgetList)} />
                <Route exact path='/budgets/import' render={this._render(routes.BudgetImport)} />
                <Route exact path='/budgets/add' render={this._render(routes.BudgetEdit)} />
                <Route exact path='/budgets/:budgetId/edit' render={this._render(routes.BudgetEdit)} />
                <Route exact path='/budgets/:budgetId' render={this._render(routes.BudgetView)} />
                <Route exact path='/budgets/:budgetId/expenses/add' render={this._render(routes.ExpenseView)} />
                <Route exact path='/budgets/:budgetId/expenses/:expenseId' render={this._render(routes.ExpenseView)} />
                <Route exact path='/categories' render={this._render(routes.CategoryList)} />
                <Route exact path='/categories/add' render={this._render(routes.AddCategory)} />
                <Route exact path='/' render={this._render(routes.BudgetList)} />
                <Route exact path='/about' render={this._render(routes.About)} />
            </Switch>);
    }

    // Function to inject properties to components rendered by router
    // eslint-disable-next-line
    private _render = (ComponentType: React.ComponentType<any>) => (
        // eslint-disable-next-line
        (props: RouteComponentProps<any>) => <React.Suspense fallback='loading view'>
            <ComponentType {...props} {...this.props}/>
        </React.Suspense>
    );
}
