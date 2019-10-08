import React from 'react';
import renderer from 'react-test-renderer';

import { AmountInput } from './AmountInput';

test('AmountInput value is 11', () => {
  const tree = renderer
    .create(<AmountInput amountInput={11} onAmountChange={(a)=>console.log(a)} label={'Amount input'} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
