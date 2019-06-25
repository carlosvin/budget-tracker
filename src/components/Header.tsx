import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from "@material-ui/core/Typography";
import { AppMenu } from "./Menu";
import './Header.css';

const MenuItems = [
    {name: 'Budgets', href: '/budgets'},
    {name: 'Categories', href: '/categories'},
    {name: 'Import', href: '/import'},
];

export const Header = (props: {title: string, actions: React.ReactNode}) => {

    return (
    <AppBar position='sticky'>
        <Toolbar>
            <AppMenu {...MenuItems}/>
            <Typography color='inherit' variant='h6' className='headerAppTitle'>{props.title}</Typography>
            {props.actions}
        </Toolbar>
    </AppBar>);
}
