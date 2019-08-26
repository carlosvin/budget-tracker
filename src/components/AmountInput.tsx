import * as React from "react";
import { TextInput } from "./TextInput";
import { round } from "../domain/utils/round";

interface AmountInputProps {
    label?: string;
    amountInput?: number;
    onAmountChange: (amount: number) => void;
    helperText?: string;
    disabled?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = (props) => {

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amountFloat = parseFloat(event.target.value);
        props.onAmountChange(amountFloat);
    }

    function value() {
        if (props.amountInput) {
            return round(props.amountInput, 2);
        }
        return '';
    }

    return (
        <TextInput
            autoFocus
            required
            type='number'
            label={props.label || 'Amount'}
            value={value()}
            inputProps={{ step: '.01', 'aria-required': true }}
            onChange={handleAmountChange}
            helperText={props.helperText}
            disabled={props.disabled}
        />
    );
}

