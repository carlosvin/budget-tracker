/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { baseAlt } from './constants';

const style = css`
  color: hotpink;
  display: flex;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  flex-direction: row;
  position: fixed;
`;

export interface AppBarProps {
    title: string;
}

export const AppBar: React.FC<AppBarProps> = (props) => (
    <header css={[style, baseAlt]}>
      <h1>{props.title}</h1>
      {props.children}
    </header>
  );
  