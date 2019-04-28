import * as React from "react";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@material-ui/core";
import { NavLink, Link, LinkProps } from "react-router-dom";
import { ButtonProps } from "@material-ui/core/Button";

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
