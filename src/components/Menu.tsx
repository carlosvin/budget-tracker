
import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from 'react-router-dom';
import { BudgetPath } from "../domain/paths/BudgetPath";
import { CategoryPaths } from "../domain/paths/CategoryPaths";
import { AppPaths } from "../domain/paths";
import { useLocalization } from "../hooks/useLocalization";

export const AppMenu: React.FC = () => {

    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const loc = useLocalization();

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
                <AppMenuItem name={loc.get('Budgets')} path={BudgetPath.base}/>
                <AppMenuItem name={loc.get('Categories')} path={CategoryPaths.List} />
                <AppMenuItem name={loc.get('Import & Export')} path={AppPaths.ImportExport} />
                <AppMenuItem name={loc.get('Account sync')} path={AppPaths.Sync} />
                <AppMenuItem name={loc.get('About')} path={AppPaths.About} />
            </Menu>
        </React.Fragment>
    );
}
