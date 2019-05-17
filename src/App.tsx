import * as React from "react";

import { Header } from "./views/Header";
import { BrowserRouter as Router } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { Routes } from "./routes";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

export const App = () => {
    const [title, setTitle] = React.useState('Budget tracker');
    
    return (
        <Router basename='/budget-tracker'>
            <CssBaseline />
            <Header title={title} />
            <main>
                <Container maxWidth='lg'>
                    <Box mt={2}>
                        <Routes onTitleChange={setTitle} />
                    </Box>
                </Container>
            </main>
        </Router>);
}