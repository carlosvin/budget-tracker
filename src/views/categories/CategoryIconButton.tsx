import * as React from 'react';
import { CategoryIconType } from '../../stores/IconsStore';
import { AppButton } from '../buttons';

interface CategoryIconButtonProp {
    icon: CategoryIconType;
    onClick: (icon: CategoryIconType) => void;
};

// TODO this component might be reused for any react component
export class CategoryIconButton extends React.PureComponent<CategoryIconButtonProp> {

    render () {
        return (
            <AppButton onClick={this.handleClick} icon={this.props.icon} />
        );
    }

    private handleClick = () => {
        this.props.onClick(this.props.icon);
    }

}

