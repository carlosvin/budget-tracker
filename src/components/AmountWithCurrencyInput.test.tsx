import React from 'react';
import AmountWithCurrencyInput from './AmountWithCurrencyInput';
import renderer from 'react-test-renderer';
import { CurrencyRates } from '../api';

// TODO remove skip when https://github.com/mui-org/material-ui/issues/14357 is fixed
test.skip('Amount Input changes', () => {
    const handleChange = (amount: number, currency: string, amountBase?: number) => {

    }

    const rates: CurrencyRates = {
        base: 'EUR',
        rates: { 'BTH': 35, 'USD': 0.8 },
        date: new Date()
    };

    const component = renderer.create(
        <AmountWithCurrencyInput
            rates={rates}
            onChange={handleChange} 
            selectedCurrency='USD' />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // manually trigger the callback
    //tree.props.onMouseEnter();
    // re-rendering
    //tree = component.toJSON();
    //expect(tree).toMatchSnapshot();

    // manually trigger the callback
    //tree.props.onMouseLeave();
    // re-rendering
    //tree = component.toJSON();
    //expect(tree).toMatchSnapshot();
});