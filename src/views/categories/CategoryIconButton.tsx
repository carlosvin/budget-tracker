import * as React from 'react';
import Button from '@material-ui/core/Button';
import { iconsStore } from '../../stores/IconsStore';

interface CategoryIconButtonProp {
    name: string;
    onClick: (name: string) => void;
};

// TODO this component might be reused for any react component
export class CategoryIconButton extends React.PureComponent<CategoryIconButtonProp> {

    render () {
        const Icon = iconsStore.getIcon(this.props.name);
        return (
            <Button onClick={this.handleClick}>
                <React.Suspense fallback={this.props.name}>
                    <Icon />
                </React.Suspense>
            </Button>
        );
    }

    private handleClick = () => {
        this.props.onClick(this.props.name);
    }

}

