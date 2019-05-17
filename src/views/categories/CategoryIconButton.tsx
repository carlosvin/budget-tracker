import * as React from 'react';
import { iconsStore } from '../../stores/IconsStore';
import { AppButton } from '../buttons';

interface CategoryIconButtonProp {
    name: string;
    onClick: (name: string) => void;
};

// TODO this component might be reused for any react component
export class CategoryIconButton extends React.PureComponent<CategoryIconButtonProp> {

    render () {
        const Icon = iconsStore.getIcon(this.props.name);
        return (
            <AppButton onClick={this.handleClick} component={Icon}/>
        );
    }

    private handleClick = () => {
        this.props.onClick(this.props.name);
    }

}

