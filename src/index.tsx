
import * as serviceWorker from './serviceWorker';
import React from 'react';
import App from './App';
import { BudgetTrackerImpl } from './BudgetTrackerImpl';
import { hydrate, render } from 'react-dom';

const btApp = new BudgetTrackerImpl();

const rootElement = document.getElementById('root');

if (rootElement && rootElement.hasChildNodes()) {
    hydrate(<App btApp={btApp} />, rootElement);
} else {
    render(<App btApp={btApp} />, rootElement);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
