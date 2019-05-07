import * as React from "react";
import { Link } from "react-router-dom";

export const MyLink = React.forwardRef((props: {href: string}, ref: any) => (
    <Link to={props.href} {...props} ref={ref} />
));
