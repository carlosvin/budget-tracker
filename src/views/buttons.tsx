
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
    <AppButton {...props} icon={AddIcon} color='primary' variant='contained'/>
);

export const EditButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={EditIcon} />
);

export const CancelButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={CancelIcon}/>
);

export const DeleteButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={DeleteIcon}/>
);

export const SaveButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={SaveIcon}/>
);

export const TextButton = (props: AppButtonProps) => (
    <AppButton {...props} href={props.href} variant='text'/>
);

export const ImportButton = (props: AppButtonProps) => (
    <AppButton {...props} href={props.href} icon={ImportExportIcon} />
);
