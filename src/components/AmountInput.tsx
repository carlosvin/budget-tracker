import * as React from "react";
import { TextInput } from "./TextInput";

interface AmountInputProps {
    label?: string;
    amountInput?: number;
    onAmountChange: (amount: number) => void;
    helperText?: string;
}

export const AmountInput: React.FC<AmountInputProps> = (props) => {

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amountFloat = parseFloat(event.target.value);
        props.onAmountChange(amountFloat);
    }

    return (
        <TextInput 
            autoFocus
            required
            type='number'
            label={props.label || 'Amount'}
            value={props.amountInput || ''}
            inputProps={{ step: '.01', 'aria-required': true }}
            onChange={handleAmountChange}
            helperText={props.helperText}
        />
    );           
}

