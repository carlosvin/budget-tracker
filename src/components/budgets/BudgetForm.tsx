
import * as React from 'react';
import { Budget } from '../../api';
import { TextInput } from '../TextInput';
import { getISODateString } from '../../domain/date';
import { AmountInput } from '../AmountInput';
import { CurrencyInput } from '../CurrencyInput';
import { SaveButtonFab } from '../buttons/SaveButton';
import { useLoc } from '../../hooks/useLoc';

interface BudgetFormProps {
    budget: Budget;
    onSubmit: (budget: Budget) => void;
    disabled?: boolean;
}

export const BudgetForm: React.FC<BudgetFormProps> = (props) => {
    const [budget, setBudget] = React.useState<Budget>(props.budget);
    const [error, setError] = React.useState();
    const [saveDisabled, setSaveDisabled] = React.useState(true);
    const {disabled} = props;
    const loc = useLoc();

    function onChange () {
        setError(undefined);
        setSaveDisabled(false);
    }

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        const err = validate();
        if (err) {
            setError(validate());
        } else if (!saveDisabled) {
            props.onSubmit(budget);
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setBudget({...budget, name: e.target.value});
        onChange();
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setBudget({...budget, to: new Date(e.target.value).getTime()});
        onChange();
    };

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setBudget({...budget, from: new Date(e.target.value).getTime()});
        onChange();
    };

    const handleAmountChange = (total: number) => {
        setBudget({...budget, total});
        onChange();
    };

    const handleCurrencyChange = (currency: string) => {
        setBudget({...budget, currency});
        onChange();
    };

    function validate () {
        if (budget.from >= budget.to) {
            return loc('Invalid date range');
        }
        return undefined;
    }

    return (
        <form onSubmit={handleSubmit} >
            <TextInput label={loc('Name')} value={budget.name} onChange={handleNameChange} required disabled={disabled}/>
            <TextInput label={loc('Start')} value={getISODateString(new Date(budget.from))} type='date' onChange={handleFromChange} error={error} required  disabled={disabled}/>
            <TextInput label={loc('End')} value={getISODateString(new Date(budget.to))} type='date' error={error} onChange={handleToChange} disabled={disabled}/>
            <AmountInput 
                disabled={disabled}
                onAmountChange={handleAmountChange}
                label={loc('Total')}
                amountInput={budget.total}
            />
            <CurrencyInput 
                disabled={disabled}
                onCurrencyChange={handleCurrencyChange}
                selectedCurrency={budget.currency}
            />
            <SaveButtonFab disabled={disabled || saveDisabled} color='primary' type='submit'/>
        </form>
    );
}