import * as React from "react";
import * as ReactDOM from "react-dom";
import { BudgetList } from "./views/BudgetList";
import { Header } from "./views/Header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { About } from "./views/About";
import 'babel-polyfill';

class App extends React.PureComponent {
    render() {
        return <Router>
            <div>
                <Header />
                <Route exact path="/" component={BudgetList} />
                <Route path="/about" component={About} />
                <Route path="/budgets" component={BudgetList} />
            </div>
        </Router>;
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
