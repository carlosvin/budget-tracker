import * as React from 'react';
import Button from '@material-ui/core/Button';
import CategoryIcon from './CategoryIcon';

interface CategoryIconButtonProp {
    name: string;
    onClick: (name: string) => void;
};

export const CategoryIconButton: React.FC<CategoryIconButtonProp> = (props) => {

    const {name} = props;

    return (
        <Button onClick={() => props.onClick(name)} variant='outlined'>
            <CategoryIcon name={name}/>
        </Button>
    );
}

export default CategoryIconButton;
