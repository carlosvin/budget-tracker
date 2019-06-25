
import * as React from 'react';
import { Budget } from '../interfaces';
import { TextInput } from './TextInput';
import AmountWithCurrencyInput from './AmountWithCurrencyInput';
import { SaveButtonFab } from './buttons';
import { DAY_MS } from '../BudgetModel';
import { getDateString, uuid } from '../utils';

interface BudgetFormProps {
    budget?: Budget;
    onSubmit: (budget: Budget) => void;
    disabled?: boolean;
}

export const BudgetForm: React.FC<BudgetFormProps> = (props) => {

    function getProperty (name: string, defaultValue: string|number) {
        if (props.budget) {
            return (props.budget as any)[name];
        }
        return defaultValue;
    }
    
    //const [identifier, setIdentifier] = React.useState(getProperty('identifier', uuid()));
    const [name, setName] = React.useState(getProperty('name', ''));
    const [to, setTo] = React.useState(getProperty('to', new Date().getTime() + (DAY_MS * 30)));
    const [from, setFrom] = React.useState(getProperty('from', new Date().getTime()));
    const [currency, setCurrency] = React.useState(getProperty('currency', 'EUR'));
    const [total, setTotal] = React.useState(getProperty('total', ''));
    const [error, setError] = React.useState();

  

    function buildBudgetFromState (): Budget {
        return {
            identifier: getProperty('identifier', uuid()),
            currency,
            from,
            name,
            to,
            total
        };
    }

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const err = validate();
        if (err) {
            setError(validate());
        } else {
            props.onSubmit(buildBudgetFromState());
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setName(e.target.value);
        setError(undefined);
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setTo(new Date(e.target.value).getTime());
        setError(undefined);
    };

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFrom(new Date(e.target.value).getTime());
        setError(undefined);
    };

    const handleAmountChange = (total: number, currency: string) => {
        setTotal(total);
        setCurrency(currency);
        setError(undefined);
    };

    function validate () {
        if (from >= to) {
            return 'Invalid date range';
        }
        return undefined;
    }

    return (
        <form onSubmit={handleSubmit} >
            <TextInput label='Name' value={name} onChange={handleNameChange} required disabled={props.disabled}/>
            <TextInput label='Start' value={getDateString(new Date(from))} type='date' onChange={handleFromChange} error={error} required  disabled={props.disabled}/>
            <TextInput label='End' value={getDateString(new Date(to))} type='date' error={error} onChange={handleToChange} disabled={props.disabled}/>
            <AmountWithCurrencyInput
                amountInput={total}
                selectedCurrency={currency}
                label='Total'
                onChange={handleAmountChange}
                disabled={props.disabled}
            />
            <SaveButtonFab color='primary' type='submit'/>
        </form>
    );
}