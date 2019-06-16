
import * as React from 'react';
import { MyLink } from './MyLink';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Fab from '@material-ui/core/Fab';
import './buttons.css';

type Color = 'inherit' | 'primary' | 'secondary' | 'default';
type Type = 'button' | 'submit' | 'reset';

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
            <Button color='inherit' {...this.props} {...this.derivedProps}>
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

interface ButtonFabProps {
    disabled?: boolean;
    type?: Type;
    color?: Color;
}

const ButtonFab = (props: ButtonFabProps&{children: React.ReactNode}) => (
    <Fab className={props.color === 'primary' ? 'fabR':'fabL'} 
        color={props.color||'secondary'}
        {...props}>
        {props.children}
    </Fab>);

export const SaveButtonFab = (props: ButtonFabProps) => (
    <ButtonFab aria-label='Save' {...props} >
        <SaveIcon />
    </ButtonFab>);

export const AddButton = (props: {href: string}) => (
    <Fab component={MyLink} aria-label='Add' href={props.href} className='fabR' color='primary' >
        <AddIcon />
    </Fab>);

export const EditButton = (props: AppButtonProps) => (
    <AppButton icon={EditIcon} {...props} />
);

export const CloseButton = (props: AppButtonProps) => (
    <AppButton icon={CloseIcon} aria-label='Close' {...props} />
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
