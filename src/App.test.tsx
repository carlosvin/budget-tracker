import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createBudgetTrackerMock } from './__mocks__/budgetTracker';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App btApp={createBudgetTrackerMock()}/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
