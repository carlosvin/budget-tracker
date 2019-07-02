
import * as React from 'react';
import { Budget } from '../interfaces';
import { TextInput } from './TextInput';
import { SaveButtonFab } from './buttons';
import { DAY_MS } from '../BudgetModel';
import { getDateString, uuid } from '../utils';
import { AmountInput } from './AmountInput';
import { CurrencyInput } from './CurrencyInput';

interface BudgetFormProps {
    budget?: Budget;
    onSubmit: (budget: Budget) => void;
    disabled?: boolean;
}

export const BudgetForm: React.FC<BudgetFormProps> = (props) => {
    
    const [budget, setBudget] = React.useState<Budget>({ 
        name: '', 
        from: new Date().getTime(), 
        to: new Date().getTime() + (DAY_MS * 30),
        currency: 'EUR',
        total: 0,
        identifier: uuid()
    });

    const [error, setError] = React.useState();

    React.useEffect(
        () => {
            setBudget({...budget, ...props.budget})
        }// eslint-disable-next-line 
        ,[props.budget]);

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const err = validate();
        if (err) {
            setError(validate());
        } else {
            props.onSubmit(budget);
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setBudget({...budget, name: e.target.value});
        setError(undefined);
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setBudget({...budget, to: new Date(e.target.value).getTime()});
        setError(undefined);
    };

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setBudget({...budget, from: new Date(e.target.value).getTime()});
        setError(undefined);
    };

    const handleAmountChange = (total: number) => {
        setBudget({...budget, total});
        setError(undefined);
    };

    const handleCurrencyChange = (currency: string) => {
        setBudget({...budget, currency});
        setError(undefined);
    };

    function validate () {
        if (budget.from >= budget.to) {
            return 'Invalid date range';
        }
        return undefined;
    }

    return (
        <form onSubmit={handleSubmit} >
            <TextInput label='Name' value={budget.name} onChange={handleNameChange} required disabled={props.disabled}/>
            <TextInput label='Start' value={getDateString(new Date(budget.from))} type='date' onChange={handleFromChange} error={error} required  disabled={props.disabled}/>
            <TextInput label='End' value={getDateString(new Date(budget.to))} type='date' error={error} onChange={handleToChange} disabled={props.disabled}/>
            <AmountInput 
                disabled={props.disabled}
                onAmountChange={handleAmountChange}
                label='Total'
                amountInput={budget.total}
            />
            <CurrencyInput 
                disabled={props.disabled}
                onCurrencyChange={handleCurrencyChange}
                selectedCurrency={budget.currency}
            />
            <SaveButtonFab disabled={props.disabled} color='primary' type='submit'/>
        </form>
    );
}