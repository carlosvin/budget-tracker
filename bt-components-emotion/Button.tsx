/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { base } from './constants';

export const style = css`
  border-radius: 0.3rem;
`;

export const Button: React.FC<{}> = (props) => (
  <button css={[base, style]}>
    {props.children}
  </button>
);

export default Button;
