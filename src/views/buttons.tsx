
import * as React from 'react';
import { MyLink } from './MyLink';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

type Color = 'inherit' | 'primary' | 'secondary' | 'default';

export interface AppButtonProps {
    href?: string;
    icon?: React.ComponentType<SvgIconProps>;
    text?: string;
    color?: Color;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'text' | 'outlined' | 'contained';
    onClick?: (e: React.SyntheticEvent) => void;
}

class AppButton extends React.PureComponent<AppButtonProps> {
    
    render(){
        return (
            <Button {...this.props} {...this.derivedProps}>
                { this.props.icon && <this.props.icon />}
                { this.props.text }
            </Button>);
    }

    get derivedProps () {
        const props = {
            component: this.props.href ? MyLink : undefined,
        };
        if (this.props.onClick && this.props.href) {
            console.warn('Button should not have both onClick and href properties');
        }
        return props;
    }
}

export const AddButton = (props: AppButtonProps) => (
    <AppButton icon={AddIcon} color='primary' variant='contained' aria-label='Add' {...props} />
);

export const EditButton = (props: AppButtonProps) => (
    <AppButton icon={EditIcon} {...props} />
);

export const CancelButton = (props: AppButtonProps) => (
    <AppButton icon={CancelIcon} aria-label='Cancel' {...props} />
);

export const DeleteButton = (props: AppButtonProps) => (
    <AppButton icon={DeleteIcon} aria-label='Delete' {...props}/>
);

export const SaveButton = (props: AppButtonProps) => (
    <AppButton icon={SaveIcon} aria-label='Save' {...props}/>
);

export const TextButton = (props: AppButtonProps) => (
    <AppButton href={props.href} variant='text' aria-label={props.text} {...props} />
);

export const ImportButton = (props: AppButtonProps) => (
    <AppButton href={props.href} icon={ImportExportIcon} aria-label='Import' {...props} />
);
