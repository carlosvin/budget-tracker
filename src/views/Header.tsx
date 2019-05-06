import * as React from "react";
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { MyLink } from "./MyLink";

export class Header extends React.PureComponent {
    render () {
        return <AppBar position="static">
            <Toolbar>
                <Button color='inherit' component={MyLink} href='/about' >About</Button>
                <Button color='inherit' component={MyLink} href='/budgets'>Budgets</Button>
                <Button color='inherit' component={MyLink} href='/categories'>Categories</Button>
            </Toolbar>
        </AppBar>;
    }
}
