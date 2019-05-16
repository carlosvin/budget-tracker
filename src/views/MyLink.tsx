import * as React from "react";
import { Link } from "react-router-dom";
import { ListItemProps } from "@material-ui/core/ListItem";
import { ButtonProps } from "@material-ui/core/Button";
import { LinkProps } from "@material-ui/core/Link";

export const MyLink = React.forwardRef((props: ListItemProps&ButtonProps&LinkProps, ref: React.LegacyRef<Link>) => (
    <Link to={props.href||'#error'} {...props}  ref={ref} />
));

MyLink.displayName = 'MyLink';
