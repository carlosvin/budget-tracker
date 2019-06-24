import React from 'react';
import { Header } from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes } from "./routes";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import CssBaseline from '@material-ui/core/CssBaseline';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Migrator } from './Migrator';
import { SnackbarContent } from '@material-ui/core';

const App: React.FC = () => {
    const [title, setTitle] = React.useState('Budget tracker');
    const [actions, setActions] = React.useState();
    const [shouldMigrate, setShouldMigrate] = React.useState(
        Migrator.shouldMigrateToV1());

    React.useEffect(
        () => { 
            const migrate = async () => {
                if (shouldMigrate) {
                    await Migrator.migrateToV1();
                    setShouldMigrate(Migrator.shouldMigrateToV1());
                }
            }
            migrate();
        }
    );

    if (shouldMigrate) {
        return <SnackbarContent message='Migrating expenses...' />;
    }

    return (
        <Router basename='/budget-tracker'>
            <CssBaseline />
            <Header title={title} actions={actions} />
            <main>
                <Container maxWidth='lg'>
                    <Box mt={2}>
                        <ErrorBoundary>
                            <Routes onTitleChange={setTitle} onActions={setActions} />
                        </ErrorBoundary>
                    </Box>
                </Container>
            </main>
        </Router>);
}

export default App;
