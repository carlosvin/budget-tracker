import { useEffect, ReactNode } from "react";
import { HeaderNotifierProps } from "../routes";

export function useHeaderContext(title: string, actions: ReactNode, props: HeaderNotifierProps) {
    useEffect(() => {
        props.onTitleChange(title);
        props.onActions(actions);
        return function () {
            props.onTitleChange('');
            props.onActions(undefined);
        }
    // eslint-disable-next-line
    }, []);
}
