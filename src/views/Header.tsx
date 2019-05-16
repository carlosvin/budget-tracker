import * as React from "react";
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { MyLink } from "./MyLink";
import { Typography, Grid } from "@material-ui/core";

export class Header extends React.PureComponent<{title: string}> {
    render () {
        return <AppBar position='sticky'>
            <Toolbar>
                <Grid container justify='space-between'>
                    <Grid item>
                        <Typography color='inherit' variant='h6'>{this.props.title}</Typography>
                    </Grid>
                    <Grid item>
                        <Button color='inherit' component={MyLink} href='/budgets'>Budgets</Button>
                        <Button color='inherit' component={MyLink} href='/categories'>Categories</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>;
    }
}
