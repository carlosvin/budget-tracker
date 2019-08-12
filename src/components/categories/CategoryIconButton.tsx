import * as React from 'react';
import Button from '@material-ui/core/Button';
import { btApp } from '../../BudgetTracker';

interface CategoryIconButtonProp {
    name: string;
    onClick: (name: string) => void;
};

export const CategoryIconButton: React.FC<CategoryIconButtonProp> = (props) => {

    const [Icon, setIcon] = React.useState();
    const [color, setColor] = React.useState();
    const {name} = props;

    React.useEffect(
        ()=>{
            async function initIcon () {
                const store = await btApp.getIconsStore();
                setIcon(store.getIcon(name));
                setColor(store.getColor(name));
            }
            initIcon();
        }, [name]
    );

    return (
        <Button onClick={() => props.onClick(name)} variant='outlined'>
            <React.Suspense fallback={name}>
                {Icon && <Icon style={{color: color}}/>}
            </React.Suspense>
        </Button>
    );
}

export default CategoryIconButton;
