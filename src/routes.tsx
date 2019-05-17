import * as React from "react";
import { Route, Switch } from "react-router";
import { TitleNotifierProps } from "./interfaces";

const routes = {
    About: React.lazy(() => import('./views/About')),
    BudgetView: React.lazy(() => import('./views/budgets/Budget')),
    BudgetList: React.lazy(() => import('./views/budgets/BudgetList')),
    BudgetEdit: React.lazy(() => import('./views/budgets/BudgetEdit')),
    BudgetImport: React.lazy(() => import('./views/budgets/Import')),
    ExpenseView: React.lazy(() => import('./views/expenses/Expense')),
    CategoryList: React.lazy(() => import('./views/categories/CategoryList')),
    AddCategory: React.lazy(() => import('./views/categories/AddCategory')),
    EditCategory: React.lazy(() => import('./views/categories/EditCategory'))
};

export class Routes extends React.PureComponent<TitleNotifierProps> {
    render() {
        return (
            <Switch>
                <Route path="/about" render={this.withRender(routes.About)} />
                <Route exact path="/budgets" render={this.withRender(routes.BudgetList)} />
                <Route exact path='/budgets/import' render={this.withRender(routes.BudgetImport)} />
                <Route exact path='/budgets/add' render={this.withRender(routes.BudgetEdit)} />
                <Route exact path='/budgets/:budgetId/edit' render={this.withRender(routes.BudgetEdit)} />
                <Route exact path='/budgets/:budgetId' render={this.withRender(routes.BudgetView)} />
                <Route exact path='/budgets/:budgetId/expenses/add' render={this.withRender(routes.ExpenseView)} />
                <Route exact path='/budgets/:budgetId/expenses/:expenseId' render={this.withRender(routes.ExpenseView)} />
                <Route exact path='/categories' render={this.withRender(routes.CategoryList)} />
                <Route exact path='/categories/add' render={this.withRender(routes.AddCategory)} />
                <Route exact path='/categories/:name' render={this.withRender(routes.EditCategory)} />
                <Route exact path='/' render={this.withRender(routes.BudgetList)} />
            </Switch>);
    }

    // Function to inject properties to components rendered by router
    // eslint-disable-next-line
    private withRender = (ComponentType: React.ComponentType<any>) => (
        (props: {}) => (
            <React.Suspense fallback='loading view'>
                <ComponentType {...props} {...this.props}/>
            </React.Suspense>
        )
    );
}
