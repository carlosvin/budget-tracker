import * as React from "react";
import { Route, Switch, RouteComponentProps } from "react-router";
import { BudgetPath } from "./domain/paths/BudgetPath";
import { ExpensePath } from "./domain/paths/ExpensePath";
import { CategoryPaths } from "./domain/paths/CategoryPaths";
import { AppPaths } from "./domain/paths";
import CircularProgress from "@material-ui/core/CircularProgress";

const routes = {
    BudgetView: React.lazy(() => import('./views/budgets/Budget')),
    BudgetList: React.lazy(() => import('./views/budgets/BudgetList')),
    BudgetCombined: React.lazy(() => import('./views/budgets/BudgetCombined')),
    BudgetEdit: React.lazy(() => import('./views/budgets/BudgetEdit')),
    BudgetStats: React.lazy(() => import('./views/budgets/Stats')),
    BudgetExport: React.lazy(() => import('./views/budgets/Export')),
    ExpenseView: React.lazy(() => import('./views/expenses/ExpenseEdit')),
    ExpenseAdd: React.lazy(() => import('./views/expenses/ExpenseAdd')),
    ExpensesView: React.lazy(() => import('./views/expenses/Expenses')),
    CategoryList: React.lazy(() => import('./views/categories/CategoryList')),
    AddCategory: React.lazy(() => import('./views/categories/AddCategory')),
    ImportExport: React.lazy(() => import('./views/ImportExport')),
    About: React.lazy(() => import('./views/About')),
    Sync: React.lazy(() => import('./views/Sync')),
    Privacy: React.lazy(() => import('./views/PrivacyPolicy'))
};

export interface HeaderNotifierProps {
    onTitleChange: (title: string) => void;
    onActions: (actions: React.ReactNode) => void;
}

// Function to inject properties to components rendered by router
function _render(ComponentType: React.ComponentType<any>, parentProps: HeaderNotifierProps) {
    return (props: RouteComponentProps<any>) => <React.Suspense fallback={<CircularProgress/>}>
            <ComponentType {...props} {...parentProps}/>
        </React.Suspense>;
}

const budgetUrl = new BudgetPath(':budgetId');
const expenseUrl = new ExpensePath(':expenseId', budgetUrl);

export const Routes: React.FC<HeaderNotifierProps> = (props) => (
    <Switch>
        <Route exact path={BudgetPath.base} render={_render(routes.BudgetList, props)} />
        <Route exact path={BudgetPath.add} render={_render(routes.BudgetEdit, props)} />
        <Route exact path={BudgetPath.combined} render={_render(routes.BudgetCombined, props)} />
        <Route exact path={budgetUrl.pathEdit} render={_render(routes.BudgetEdit, props)} />
        <Route exact path={budgetUrl.pathStats} render={_render(routes.BudgetStats, props)} />
        <Route exact path={budgetUrl.pathExport} render={_render(routes.BudgetExport, props)} />
        <Route exact path={budgetUrl.path} render={_render(routes.BudgetView, props)} />
        <Route exact path={budgetUrl.pathAddExpense} render={_render(routes.ExpenseAdd, props)} />
        <Route exact path={expenseUrl.path} render={_render(routes.ExpenseView, props)} />
        <Route exact path={budgetUrl.pathExpenses} render={_render(routes.ExpensesView, props)} />
        <Route exact path={CategoryPaths.List} render={_render(routes.CategoryList, props)} />
        <Route exact path={CategoryPaths.Add} render={_render(routes.AddCategory, props)} />
        <Route exact path='/' render={_render(routes.BudgetList, props)} />
        <Route exact path={AppPaths.ImportExport} render={_render(routes.ImportExport, props)} />
        <Route exact path={AppPaths.About} render={_render(routes.About, props)} />
        <Route exact path={AppPaths.Sync} render={_render(routes.Sync, props)} />
        <Route exact path={AppPaths.Privacy} render={_render(routes.Privacy, props)} />
    </Switch>
);
