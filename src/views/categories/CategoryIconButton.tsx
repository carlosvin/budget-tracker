import * as React from 'react';
import { IconName } from '../../stores/IconsStore';
import { AppButton } from '../buttons';

interface CategoryIconButtonProp {
    icon: IconName;
    onClick: (icon: IconName) => void;
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

