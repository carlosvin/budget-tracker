import * as React from "react";
import * as ReactDOM from "react-dom";
import { Header } from "./views/Header";
import { BrowserRouter as Router } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from "@material-ui/core/Paper";
import { Routes } from "./routes";

class App extends React.PureComponent {

    constructor(props: {}) {
        super(props);
        console.log('App instantiated');
        // TODO fetch currencies
    }

    render() {
        return (
            <Router basename='/budget-tracker'>
                <CssBaseline/>
                <Header />
                <main>
                    <Paper elevation={1}>
                        <Routes />
                    </Paper>
                </main>
            </Router>);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
