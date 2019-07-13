import React from 'react';
import ReactDOM from 'react-dom';
import AmountWithCurrencyInput from './AmountWithCurrencyInput';
import renderer from 'react-test-renderer';

test('Amount Input changes', () => {
    const handleChange = (amount: number, currency: string, amountBase?: number) => {

    }
    const component = renderer.create(
        <AmountWithCurrencyInput 
            onChange={handleChange} 
            baseCurrency='EUR' 
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