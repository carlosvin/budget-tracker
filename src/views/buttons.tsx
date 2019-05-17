
import * as React from 'react';
import { MyLink } from './MyLink';
import Button from '@material-ui/core/Button';
import {iconsStore, IconsInternalType, LazyIcon}  from '../stores/IconsStore';

type Color = 'inherit' | 'primary' | 'secondary' | 'default';
type ButtonType = 'button' | 'submit' | 'reset';

const Icon = (props: {type: IconsInternalType}) => {
    const InternalIcon = iconsStore.getInternalIcon(props.type);
    return  <React.Suspense fallback={props.type}>
        <InternalIcon/>
    </React.Suspense>;
}

export interface AppButtonProps {
    href?: string;
    icon?: IconsInternalType;
    component?: LazyIcon;
    text?: string;
    disabled?: boolean;
    type?: ButtonType;
    color?: Color;
    onClick?: (e: React.SyntheticEvent) => void;
}

export class AppButton extends React.PureComponent<AppButtonProps> {
    
    render() {
        const Component = this.props.component;
        return (
            <Button {...this.derivedProps} {...this.props}>
                { this.props.icon ? 
                    <Icon type={this.props.icon}/> : 
                    Component && <Component /> 
                }
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
        return this.props.icon === IconsInternalType.Add ? 'contained' : 'text';
    }

    get color(): Color {
        return this.props.icon === IconsInternalType.Add ? 'primary' : 'default';
    }
}

export const AddButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={IconsInternalType.Add} href={props.href}/>
);

export const EditButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={IconsInternalType.Edit} href={props.href}/>
);
export const CancelButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={IconsInternalType.Cancel} href={props.href}/>
);

export const DeleteButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={IconsInternalType.Delete} href={props.href}/>
);

export const SaveButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={IconsInternalType.Save} href={props.href}/>
);

export const TextButton = (props: AppButtonProps) => (
    <AppButton {...props} href={props.href} text={props.text}/>
);

export const ImportButton = (props: AppButtonProps) => (
    <AppButton {...props} href={props.href} icon={IconsInternalType.ImportExport}/>
);
