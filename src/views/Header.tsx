import * as React from "react";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { ButtonProps } from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

export class Header extends React.PureComponent {
    render () {
        return <AppBar position="static">
        <Toolbar>
            <Button color='inherit' component={MyLink} href='/about' >About</Button>
            <Button color='inherit' component={MyLink} href='/budgets'>Budgets</Button>
        </Toolbar>
      </AppBar>;
    }
}

const MyLink = (props: ButtonProps) => <Link to={props.href} {...props} />
