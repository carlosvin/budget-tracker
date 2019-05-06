// It seems they are not required by babel
// import "core-js/stable/object";
// import "regenerator-runtime/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BudgetList } from "./views/BudgetList";
import { Header } from "./views/Header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { About } from "./views/About";
import { BudgetView } from "./views/Budget";
import { ExpenseView } from "./views/Expense";
import CssBaseline from '@material-ui/core/CssBaseline';
import { Paper } from "@material-ui/core";
import { AddCategory } from "./views/AddCategory";

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
                        <Route exact path="/" component={BudgetList} />
                        <Route path="/about" component={About} />
                        <Route exact path="/budgets" component={BudgetList} />
                        <Route exact path='/budgets/:id' component={BudgetView} />
                        <Route exact path='/budgets/:id/expenses/:timestamp(\d+)' component={ExpenseView} />
                        <Route exact path='/categories/add' component={AddCategory} />
                    </Paper>
                </main>
            </Router>);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
