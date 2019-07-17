import * as React from 'react';
import Button from '@material-ui/core/Button';
import { btApp } from '../BudgetTracker';

interface CategoryIconButtonProp {
    name: string;
    onClick: (name: string) => void;
};

export const CategoryIconButton: React.FC<CategoryIconButtonProp> = (props) => {
    const Icon = btApp.iconsStore.getIcon(props.name);
    const color = btApp.iconsStore.getColor(props.name);
    return (
        <Button onClick={() => props.onClick(props.name)} variant='outlined'>
            <React.Suspense fallback={props.name}>
                <Icon style={{color: color}}/>
            </React.Suspense>
        </Button>
    );
}

export default CategoryIconButton;
