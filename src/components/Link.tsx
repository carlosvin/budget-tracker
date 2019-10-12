import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import MuiLink from '@material-ui/core/Link';

export const Link: React.FC<{to: string}> = (props) => (
    <MuiLink component={RouterLink} to={props.to}>{props.children}</MuiLink>
);
