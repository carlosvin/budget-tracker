
import * as React from 'react';
import { MyLink } from './MyLink';
import {iconsStore, IconName}  from '../stores/IconsStore';
const LazyButton = React.lazy(() => import('@material-ui/core/Button'));

type Color = 'inherit' | 'primary' | 'secondary' | 'default';
type ButtonType = 'button' | 'submit' | 'reset';

const Icon = (props: {type: IconName}) => {
    const InternalIcon = iconsStore.getIcon(props.type);
    return  <React.Suspense fallback={props.type}>
        <InternalIcon/>
    </React.Suspense>;
}

export interface AppButtonProps {
    href?: string;
    icon?: IconName;
    text?: string;
    disabled?: boolean;
    type?: ButtonType;
    color?: Color;
    onClick?: (e: React.SyntheticEvent) => void;
}

export class AppButton extends React.PureComponent<AppButtonProps> {
    
    render() {
        return (
            <React.Suspense fallback={'loading'}>
            <LazyButton {...this.derivedProps} {...this.props}>
                { this.props.icon && <Icon type={this.props.icon}/> }
                { this.props.text }
            </LazyButton></React.Suspense>);
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
        return this.props.icon === IconName.Add ? 'contained' : 'text';
    }

    get color(): Color {
        return this.props.icon === IconName.Add ? 'primary' : 'default';
    }
}

export const AddButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={IconName.Add} href={props.href}/>
);

export const EditButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={IconName.Edit} href={props.href}/>
);
export const CancelButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={IconName.Cancel} href={props.href}/>
);

export const DeleteButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={IconName.Delete} href={props.href}/>
);

export const SaveButton = (props: AppButtonProps) => (
    <AppButton {...props} icon={IconName.Save} href={props.href}/>
);

export const TextButton = (props: AppButtonProps) => (
    <AppButton {...props} href={props.href} text={props.text}/>
);

export const ImportButton = (props: AppButtonProps) => (
    <AppButton {...props} href={props.href} icon={IconName.ImportExport}/>
);
