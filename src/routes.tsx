import * as React from "react";
import { Route, Switch } from "react-router";
import { BudgetList } from "./views/budgets/BudgetList";
import { About } from "./views/About";
import { BudgetEdit } from "./views/budgets/BudgetEdit";
import { BudgetView } from "./views/budgets/Budget";
import { ExpenseView } from "./views/expenses/Expense";
import { CategoryList } from "./views/categories/CategoryList";
import { AddCategory } from "./views/categories/AddCategory";
import { EditCategory } from "./views/categories/EditCategory";

export class Routes extends React.PureComponent {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={BudgetList} />
                <Route path="/about" component={About} />
                <Route exact path="/budgets" component={BudgetList} />
                <Route exact path='/budgets/add' component={BudgetEdit} />
                <Route exact path='/budgets/:id/edit' component={BudgetEdit} />
                <Route exact path='/budgets/:id' component={BudgetView} />
                <Route exact path='/budgets/:id/expenses/add' component={ExpenseView} />
                <Route exact path='/budgets/:id/expenses/:timestamp(\d+)' component={ExpenseView} />
                <Route exact path='/categories' component={CategoryList} />
                <Route exact path='/categories/add' component={AddCategory} />
                <Route exact path='/categories/:name' component={EditCategory} />
            </Switch>);
    }
}