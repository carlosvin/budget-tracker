import { useEffect, ReactNode } from "react";
import { HeaderNotifierProps } from "../routes";

export function useHeaderContext(title: string, actions: ReactNode, {onTitleChange, onActions}: HeaderNotifierProps) {
    useEffect(() => {
        onTitleChange(title);
        onActions(actions);
        return function () {
            onTitleChange('');
            onActions(undefined);
        }
    // eslint-disable-next-line
    }, []);
}
