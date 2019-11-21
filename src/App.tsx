import React from 'react';
import { Header } from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes } from "./routes";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import CssBaseline from '@material-ui/core/CssBaseline';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BudgetTracker } from './api';
import { AppProvider } from './contexts/AppContext';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({palette: { primary: { main: '#4a148c' }}});

const App: React.FC<{btApp: BudgetTracker}> = (props) => {

    const [title, setTitle] = React.useState('Budget tracker');
    // maybe use callback effect is for this purpose
    const [actions, setActions] = React.useState();

    return (
        <Router>
            <AppProvider value={props.btApp}>
                <ThemeProvider theme={theme}>
                <CssBaseline />
                    <Header title={title} actions={actions} />
                    <main>
                        <Container maxWidth='lg'>
                            <Box mt={2} marginBottom={8}>
                                <ErrorBoundary>
                                    <Routes onTitleChange={setTitle} onActions={setActions}/>
                                </ErrorBoundary>
                            </Box>
                        </Container>
                    </main>
                </ThemeProvider>
            </AppProvider>
        </Router>);
}

export default App;
