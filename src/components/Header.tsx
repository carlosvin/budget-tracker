import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from "@material-ui/core/Typography";
import { AppMenu } from "./Menu";

export interface HeaderProps {
    title: string;
    actions?: React.ReactNode;
}
export const Header: React.FC<HeaderProps> = (props) => {

    return (
    <AppBar position='sticky'>
        <Toolbar>
            <AppMenu />
            <Typography color='inherit' variant='h6' style={{flexGrow: 1}}>{props.title}</Typography>
            { props.actions }
        </Toolbar>
    </AppBar>);
}
