import * as React from "react";
import * as ReactDOM from "react-dom";
import { Header } from "./views/Header";
import { BrowserRouter as Router } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { Routes } from "./routes";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

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
                <Header title='Change me'/>
                <main>
                    <Container maxWidth='lg'>
                        <Box mt={2}>
                            <Routes />
                        </Box>
                    </Container>
                </main>
            </Router>);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
