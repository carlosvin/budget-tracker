import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from "@material-ui/core/Typography";
import { AppMenu } from "./Menu";
import './Header.css';
import { BudgetPath } from "../domain/paths/BudgetPath";
import { CategoryPaths } from "../domain/paths/CategoryPaths";
import { AppPaths } from "../domain/paths";

const MenuItems = [
    {name: 'Budgets', href: BudgetPath.base },
    {name: 'Categories', href: CategoryPaths.List},
    {name: 'Import', href: AppPaths.ImportExport},
    {name: 'Account sync', href: AppPaths.Sync},
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
