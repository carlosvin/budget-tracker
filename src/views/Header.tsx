import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { TextButton } from "./buttons";

export class Header extends React.PureComponent<{title: string}> {
    render () {
        return <AppBar position='sticky'>
            <Toolbar>
                <Grid container justify='space-between'>
                    <Grid item>
                        <Typography color='inherit' variant='h6'>{this.props.title}</Typography>
                    </Grid>
                    <Grid item>
                        <TextButton color='inherit' href='/budgets' text='Budgets'/>
                        <TextButton color='inherit' href='/categories' text='Categories'/>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>;
    }
}
