import * as React from 'react';
import Button from '@material-ui/core/Button';
import { stringToColorCss } from '../utils';
import { btApp } from '..';

interface CategoryIconButtonProp {
    name: string;
    onClick: (name: string) => void;
};

export const CategoryIconButton: React.FC<CategoryIconButtonProp> = (props) => {
    const Icon = btApp.iconsStore.getIcon(props.name);
    return (
        <Button onClick={() => props.onClick(props.name)} variant='outlined'>
            <React.Suspense fallback={props.name}>
                <Icon style={{color: `${stringToColorCss(props.name)}`}}/>
            </React.Suspense>
        </Button>
    );
}

export default CategoryIconButton;
