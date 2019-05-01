import * as React from "react";
import { Link } from "react-router-dom";

export const MyLink = (props: {href: string}) => {
    return <Link to={props.href} {...props} />;
}
