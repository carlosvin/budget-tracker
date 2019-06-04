import React from 'react';
import renderer from 'react-test-renderer';

import { AmountInput } from './AmountInput';

// TODO remove skip when https://github.com/mui-org/material-ui/issues/14357 is fixed
test.skip('AmountInput value is 11', () => {
  const tree = renderer
    .create(<AmountInput amountInput={11} onAmountChange={(a)=>console.log(a)} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
