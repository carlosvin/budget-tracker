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

class App extends React.PureComponent {
    constructor(props: {}){
        super(props);
        console.log('App instantiated');
    }

    render() {
        return (
            <Router>
                <div>
                    <Header />
                    <Route exact path="/" component={BudgetList} />
                    <Route path="/about" component={About} />
                    <Route exact path="/budgets" component={BudgetList} />
                    <Route exact path='/budgets/:id' component={BudgetView} />

                </div>
            </Router>);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
