
import * as serviceWorker from './serviceWorker';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';
import { BudgetTrackerImpl } from './BudgetTrackerImpl';

const btApp = new BudgetTrackerImpl();

ReactDOM.render(<App btApp={btApp}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
