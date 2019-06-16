import * as React from 'react';
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

export const TextInput = (props: TextFieldProps) => (
    <TextField
        id={`input-field-${props.label}`}
        style={{ margin: 8 }}
        margin='dense'            
        {...props}
    />);