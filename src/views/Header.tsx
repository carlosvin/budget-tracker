import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Tabs, Tab } from "@material-ui/core";
import { MyLink } from "./MyLink";

export const Header = (props: {title: string, actions: React.ReactNode}) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
        setValue(value);
    }

    return (<AppBar position='sticky'>
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
        <Tabs 
            value={value} 
            onChange={handleChange}
            variant='fullWidth'>
            <Tab component={MyLink} href='/budgets' label='Budgets' />
            <Tab component={MyLink} href='/categories' label='Categories' />
        </Tabs>
    </AppBar>);
}
