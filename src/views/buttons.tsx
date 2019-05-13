
import * as React from 'react';
import { MyLink } from './MyLink';
import Button, { ButtonProps } from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { Grid } from '@material-ui/core';

type Color = 'inherit' | 'primary' | 'secondary' | 'default';

type IconType = 'edit'|'add'|'cancel'|'delete'|'save'|'import';

class Icon extends React.PureComponent<{type: IconType}> {
    render () {
        switch(this.props.type){
            case 'add':
                return <AddIcon/>;
            case 'cancel':
                return <CancelIcon/>;
            case 'delete':
                return <DeleteIcon/>;
            case 'edit':
                return <EditIcon/>;
            case 'save':
                return <SaveIcon/>;
            case 'import':
                return <ImportExportIcon/>;
        }
    }
}

export interface AppButtonProps extends ButtonProps {
    href?: string;
    icon?: IconType;
    text?: string;
}

class AppButton extends React.PureComponent<AppButtonProps> {
    
    render(){
        return (
            <Button {...this.derivedProps} {...this.props}>
                { this.props.icon && <Icon type={this.props.icon}/>}
                { this.props.text }
            </Button>);
    }

    get derivedProps () {
        const props = {
            variant: this.variant,
            color: this.color,
            component: this.props.href ? MyLink : undefined,
            href: this.props.href
        };
        if (this.props.onClick && this.props.href) {
            console.warn('Button should not have both onClick and href properties');
        }
        return props;
    }

    get variant (): 'contained'|'text' {
        return this.props.icon === 'add' ? 'contained' : 'text';
    }

    get color(): Color {
        return this.props.icon === 'add' ? 'primary' : 'default';
    }
}

export const AddButton = (props: AppButtonProps) => (
    <AppButton {...props} icon='add' href={props.href}/>
);

export const EditButton = (props: AppButtonProps) => (
    <AppButton {...props} icon='edit' href={props.href}/>
);
export const CancelButton = (props: AppButtonProps) => (
    <AppButton {...props} icon='cancel' href={props.href}/>
);

export const DeleteButton = (props: AppButtonProps) => (
    <AppButton {...props} icon='delete' href={props.href}/>
);

export const SaveButton = (props: AppButtonProps) => (
    <AppButton {...props} icon='save' href={props.href}/>
);

export const TextButton = (props: AppButtonProps) => (
    <AppButton {...props} href={props.href} text={props.text}/>
);

export const ImportButton = (props: AppButtonProps) => (
    <AppButton {...props} href={props.href} icon='import'/>
);
