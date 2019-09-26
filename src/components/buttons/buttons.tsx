
import * as React from 'react';
import { Link } from 'react-router-dom';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';

type Color = 'inherit' | 'primary' | 'secondary' | 'default';
type Type = 'button' | 'submit' | 'reset';

export interface AppButtonProps {
    to?: string;
    icon?: React.ComponentType<SvgIconProps>;
    color?: Color;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'text' | 'outlined' | 'contained';
    replace?: boolean;
    onClick?: (e: React.SyntheticEvent) => void;
}

function derivedProps (props: AppButtonProps) {
    const derivedProps = {
        component: props.to ? Link : undefined,
    };
    if (props.onClick && props.to) {
        console.warn('Button should not have both onClick and href properties');
    }
    return derivedProps;
}

export const AppButton: React.FC<AppButtonProps> = (props) => (
    <IconButton color='inherit' {...props} {...derivedProps(props)}>
        { props.icon && <props.icon />}
    </IconButton>
);

export interface ButtonFabProps {
    disabled?: boolean;
    type?: Type;
    color?: Color;
    to?: string;
}

function style (color?: Color) {
    if (color === 'primary' || color === undefined) {
        return {right: '1rem'};
    } else {
        return {left: '1rem'};
    }
}

export const ButtonFab = (props: ButtonFabProps&{children: React.ReactNode}) => (
    <Fab style={{position: 'fixed', bottom: '1rem', zIndex: 10, ...style(props.color)}} 
        color={props.color||'secondary'}
        {...props}
        {...derivedProps(props)}
        >
        {props.children}
    </Fab>);

