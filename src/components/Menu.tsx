
import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from 'react-router-dom';

export const AppMenu: React.FC<{ href: string, name: string }[]> = (props) => {

    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

    const handleClick = (event: React.SyntheticEvent) => (setAnchorEl(event.currentTarget));

    const handleClose = () => (setAnchorEl(null));
    
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
                {Object.values(props).map(
                    e => <MenuItem
                        onClick={handleClose}
                        key={`menu-item-${e.name}`}
                        component={Link}
                        to={e.href}>
                        {e.name}
                    </MenuItem>
                )}
            </Menu>
        </React.Fragment>
    );
}
