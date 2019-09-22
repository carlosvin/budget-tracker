import React from 'react';
import { Header } from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes } from "./routes";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import CssBaseline from '@material-ui/core/CssBaseline';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BudgetTracker } from './interfaces';
import { AppProvider } from './contexts/AppContext';

const App: React.FC<{btApp: BudgetTracker}> = (props) => {

    const [title, setTitle] = React.useState('Budget tracker');
    // maybe use callback effect is for this purpose
    const [actions, setActions] = React.useState();

    return (
        <Router basename='/budget-tracker'>
            <AppProvider value={props.btApp}>
                <CssBaseline />
                <Header title={title} actions={actions} />
                <main>
                    <Container maxWidth='lg'>
                        <Box mt={2}>
                            <ErrorBoundary>
                                <Routes onTitleChange={setTitle} onActions={setActions}/>
                            </ErrorBoundary>
                        </Box>
                    </Container>
                </main>
            </AppProvider>
        </Router>);
}

export default App;
