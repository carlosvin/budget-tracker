
import * as React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import AccountIcon from '@material-ui/icons/AccountCircle';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Fab from '@material-ui/core/Fab';
import './buttons.css';

type Color = 'inherit' | 'primary' | 'secondary' | 'default';
type Type = 'button' | 'submit' | 'reset';

export interface AppButtonProps {
    to?: string;
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
            component: this.props.to ? Link : undefined,
        };
        if (this.props.onClick && this.props.to) {
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
    <Fab component={Link} aria-label='Add' to={props.href} className='fabR' color='primary' >
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
    <AppButton to={props.to} variant='text' aria-label={props.text} {...props} />
);

export const DownloadButton = (props: AppButtonProps) => (
    <AppButton icon={DownloadIcon} aria-label='Download' {...props}/>
);

export const ImportExportButton = (props: AppButtonProps) => (
    <AppButton icon={ImportExportIcon} aria-label='Import' {...props}/>
);

export const AccountButton = (props: AppButtonProps) => (
    <AppButton icon={AccountIcon} aria-label='Account' {...props}/>
);
