import * as React from 'react';
import { useIcon } from '../../hooks/useIcon';

interface CategoryIconProp {
    name: string;
};

export const CategoryIcon: React.FC<CategoryIconProp> = (props) => {

    const {name} = props;
    const icon = useIcon(name);

    return (
        <React.Suspense fallback={name}>
            { icon ? <icon.Icon style={{color: icon.color}}/> : null}
        </React.Suspense>
    );
}

export default CategoryIcon;
