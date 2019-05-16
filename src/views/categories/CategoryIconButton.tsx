import * as React from 'react';
import Button from '@material-ui/core/Button';
import { LazyIcon } from '../../stores/IconsStore';

interface CategoryIconButtonProp {
    name: string;
    icon: LazyIcon;
    onClick: (name: string) => void;
};

// TODO this component might be reused for any react component
export class CategoryIconButton extends React.PureComponent<CategoryIconButtonProp> {

    render (){
        return (
            <Button onClick={this.handleClick}>
                <React.Suspense fallback={this.props.name}>
                    <this.props.icon />
                </React.Suspense>
            </Button>
        );
    }

    private handleClick = () => {
        this.props.onClick(this.props.name);
    }

}

