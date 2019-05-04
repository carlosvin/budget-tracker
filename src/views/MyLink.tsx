import * as React from "react";
import { Link } from "react-router-dom";

export const MyLinkOld = (props: {href: string}, buttonRef: any) => {
    return <Link to={props.href} {...props} ref={buttonRef} />;
}
export const MyLink = React.forwardRef((props: {href: string}, ref: any) => (
    <Link to={props.href} {...props} ref={ref} />
  ));