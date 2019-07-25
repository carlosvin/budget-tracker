
import * as React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
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

export const AppButton: React.FC<AppButtonProps> = (props) => {
    
    function derivedProps () {
        const derivedProps = {
            component: props.to ? Link : undefined,
        };
        if (props.onClick && props.to) {
            console.warn('Button should not have both onClick and href properties');
        }
        return derivedProps;
    }

    return (
        <Button color='inherit' {...props} {...derivedProps()}>
            { props.icon && <props.icon />}
            { props.text }
        </Button>
    );
}

export interface ButtonFabProps {
    disabled?: boolean;
    type?: Type;
    color?: Color;
}

export const ButtonFab = (props: ButtonFabProps&{children: React.ReactNode}) => (
    <Fab className={props.color === 'primary' ? 'fabR':'fabL'} 
        color={props.color||'secondary'}
        {...props}>
        {props.children}
    </Fab>);

