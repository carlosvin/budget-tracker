import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router";

const routes = {
    BudgetView: React.lazy(() => import('./views/budgets/Budget')),
    BudgetList: React.lazy(() => import('./views/budgets/BudgetList')),
    BudgetEdit: React.lazy(() => import('./views/budgets/BudgetEdit')),
    BudgetStats: React.lazy(() => import('./views/budgets/Stats')),
    BudgetExport: React.lazy(() => import('./views/budgets/Export')),
    ExpenseView: React.lazy(() => import('./views/expenses/Expense')),
    ExpensesView: React.lazy(() => import('./views/expenses/Expenses')),
    CategoryList: React.lazy(() => import('./views/categories/CategoryList')),
    AddCategory: React.lazy(() => import('./views/categories/AddCategory')),
    Import: React.lazy(() => import('./views/Import')),
    About: React.lazy(() => import('./views/About')),
    Login: React.lazy(() => import('./views/Login'))
};

export interface HeaderNotifierProps {
    onTitleChange: (title: string) => void;
    onActions: (actions: React.ReactNode) => void;
}

// Function to inject properties to components rendered by router
function _render(ComponentType: React.ComponentType<any>, parentProps: HeaderNotifierProps) {
    return (props: RouteComponentProps<any>) => <React.Suspense fallback='loading view'>
            <ComponentType {...props} {...parentProps}/>
        </React.Suspense>;
}

export const Routes: React.FC<HeaderNotifierProps> = (props) => (
    <Switch>
        <Route exact path="/budgets" render={_render(routes.BudgetList, props)} />
        <Route exact path='/budgets/add' render={_render(routes.BudgetEdit, props)} />
        <Route exact path='/budgets/:budgetId/edit' render={_render(routes.BudgetEdit, props)} />
        <Route exact path='/budgets/:budgetId/stats' render={_render(routes.BudgetStats, props)} />
        <Route exact path='/budgets/:budgetId/export' render={_render(routes.BudgetExport, props)} />
        <Route exact path='/budgets/:budgetId' render={_render(routes.BudgetView, props)} />
        <Route exact path='/budgets/:budgetId/expenses/add' render={_render(routes.ExpenseView, props)} />
        <Route exact path='/budgets/:budgetId/expenses/:expenseId' render={_render(routes.ExpenseView, props)} />
        <Route exact 
            path='/budgets/:budgetId/expenses' 
            render={_render(routes.ExpensesView, props)} />
        <Route exact path='/categories' render={_render(routes.CategoryList, props)} />
        <Route exact path='/categories/add' render={_render(routes.AddCategory, props)} />
        <Route exact path='/' render={_render(routes.BudgetList, props)} />
        <Route exact path='/import' render={_render(routes.Import, props)} />
        <Route exact path='/about' render={_render(routes.About, props)} />
        <Route exact path='/login' render={_render(routes.Login, props)} />
    </Switch>
);
