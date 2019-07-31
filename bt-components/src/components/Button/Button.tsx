// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const style = css`
  color: hotpink;
`;

export const Button: React.FC<{}> = (props) => (
  <button css={style}>
    Some hotpink text.
    {props.children}
  </button>
);

const anotherStyle = css({
  textDecoration: 'underline'
});

const AnotherComponent = () => (
  <div css={anotherStyle}>Some text with an underline.</div>
);

export default Button;
