import * as React from 'react';
import Button from '@material-ui/core/Button';
import { iconsStore } from '../../stores/IconsStore';

interface CategoryIconButtonProp {
    name: string;
    onClick: (name: string) => void;
};

export const CategoryIconButton: React.FC<CategoryIconButtonProp> = (props) => {
    const Icon = iconsStore.getIcon(props.name);
    return (
        <Button onClick={() => props.onClick(props.name)} variant='outlined'>
            <React.Suspense fallback={props.name}>
                <Icon />
            </React.Suspense>
        </Button>
    );
}

export default CategoryIconButton;
