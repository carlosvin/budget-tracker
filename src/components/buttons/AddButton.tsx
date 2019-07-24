
import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import { Fab } from '@material-ui/core';
import './buttons.css';

export const AddButton = (props: {href: string}) => (
    <Fab component={Link} aria-label='Add' to={props.href} className='fabR' color='primary' >
        <AddIcon />
    </Fab>);