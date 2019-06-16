import React from 'react';
import { Header } from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes } from "./routes";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import CssBaseline from '@material-ui/core/CssBaseline';

const App: React.FC = () => {
    const [title, setTitle] = React.useState('Budget tracker');
    const [actions, setActions] = React.useState();
    
  return (
      <Router basename='/budget-tracker'>
          <CssBaseline />
          <Header title={title} actions={actions} />
          <main>
              <Container maxWidth='lg'>
                  <Box mt={2}>
                      <Routes onTitleChange={setTitle} onActions={setActions}/>
                  </Box>
              </Container>
          </main>
      </Router>);
}

export default App;
