import * as React from "react";
import { Link } from "react-router-dom";

export const MyLink = React.forwardRef((props: {href: string}, ref: React.LegacyRef<Link>) => (
    <Link to={props.href} {...props} ref={ref} />
));

MyLink.displayName = 'MyLink';
