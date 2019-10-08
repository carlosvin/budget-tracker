
import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from 'react-router-dom';
import { useLoc } from "../hooks/useLoc";
import { BudgetPath } from "../domain/paths/BudgetPath";
import { CategoryPaths } from "../domain/paths/CategoryPaths";
import { AppPaths } from "../domain/paths";

export const AppMenu: React.FC = () => {

    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const loc = useLoc();

    const handleClick = (event: React.SyntheticEvent) => (setAnchorEl(event.currentTarget));

    const handleClose = () => (setAnchorEl(null));

    const AppMenuItem = React.forwardRef((props: {name: string, path: string}, ref) => {
        return <MenuItem onClick={handleClose} component={Link} to={props.path}>
                {props.name}
            </MenuItem>;
    });

    return (
        <React.Fragment>
            <IconButton edge="start" color="inherit" aria-label="Menu" onClick={handleClick}>
                <MenuIcon />
            </IconButton>
            <Menu
                id='app-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <AppMenuItem name={loc('Budgets')} path={BudgetPath.base}/>
                <AppMenuItem name={loc('Categories')} path={CategoryPaths.List} />
                <AppMenuItem name={loc('Import & Export')} path={AppPaths.ImportExport} />
                <AppMenuItem name={loc('Account sync')} path={AppPaths.Sync} />
                <AppMenuItem name={loc('About')} path={AppPaths.About} />
            </Menu>
        </React.Fragment>
    );
}
