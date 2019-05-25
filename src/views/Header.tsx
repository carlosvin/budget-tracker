import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export const Header = (props: {title: string, actions: React.ReactNode}) => (
    <AppBar position='sticky'>
        <Toolbar>
            <Grid container justify='space-between'>
                <Grid item>
                    <Typography color='inherit' variant='h6'>{props.title}</Typography>
                </Grid>
                <Grid item>
                    {props.actions}
                </Grid>
            </Grid>
        </Toolbar>
    </AppBar>
);
