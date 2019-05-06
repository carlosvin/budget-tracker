// It seems they are not required by babel
// import "core-js/stable/object";
// import "regenerator-runtime/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BudgetList } from "./views/BudgetList";
import { Header } from "./views/Header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { About } from "./views/About";
import { BudgetView } from "./views/Budget";
import { ExpenseView } from "./views/Expense";
import CssBaseline from '@material-ui/core/CssBaseline';
import { Paper } from "@material-ui/core";
import { AddCategory } from "./views/categories/AddCategory";
import { EditCategory } from "./views/categories/EditCategory";
import { CategoryList } from "./views/categories/CategoryList";

// TODO extract App to external file
class App extends React.PureComponent {
    constructor(props: {}){
        super(props);
        console.log('App instantiated');
        // TODO fetch currencies
    }

    render() {
        return (
            <Router>
                <CssBaseline/>
                <Header />
                <main>
                    <Paper elevation={1}>
                        <Switch>
                            <Route exact path="/" component={BudgetList} />
                            <Route path="/about" component={About} />
                            <Route exact path="/budgets" component={BudgetList} />
                            <Route exact path='/budgets/:id' component={BudgetView} />
                            <Route exact path='/budgets/:id/expenses/:timestamp(\d+)' component={ExpenseView} />
                            <Route exact path='/categories' component={CategoryList} />
                            <Route exact path='/categories/add' component={AddCategory} />
                            <Route exact path='/categories/:name' component={EditCategory} />
                        </Switch>
                    </Paper>
                </main>
            </Router>);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
