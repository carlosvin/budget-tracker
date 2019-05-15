import * as React from "react";
import { Link } from "react-router-dom";
import { ListItemProps } from "@material-ui/core/ListItem";

export const MyLink = React.forwardRef((props: ListItemProps, ref: React.LegacyRef<Link>) => (
    <Link to={props.href||'#error'} {...props}  ref={ref} />
));

MyLink.displayName = 'MyLink';
