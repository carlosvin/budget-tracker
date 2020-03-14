
import * as React from 'react';
import { Budget } from '../../api';
import { TextInput } from '../TextInput';
import { getISODateString } from '../../domain/date';
import { AmountInput } from '../AmountInput';
import { CurrencyInput } from '../CurrencyInput';
import { SaveButtonFab } from '../buttons/SaveButton';
import { useCurrenciesStore } from '../../hooks/useCurrenciesStore';
import { useLocalization } from '../../hooks/useLocalization';

interface BudgetFormProps {
    budget: Budget;
    onSubmit: (budget: Budget) => void;
    disabled?: boolean;
}

export const BudgetForm: React.FC<BudgetFormProps> = (props) => {
    const [budget, setBudget] = React.useState<Budget>(props.budget);
    const [error, setError] = React.useState<string>();
    const [saveDisabled, setSaveDisabled] = React.useState(true);
    const {disabled} = props;
    const loc = useLocalization();
    const store = useCurrenciesStore();

    const {currencies, lastCurrenciesUsed} = React.useMemo(() => (
        store ? 
            {currencies: store.currencies, lastCurrenciesUsed: [...store.lastCurrenciesUsed]} : 
            {currencies: new Map(), lastCurrenciesUsed: []}
    ), [store]);

    function onChange () {
        setError(undefined);
        setSaveDisabled(false);
    }

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        const err = validate();
        if (err) {
            setError(err);
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
            return loc.get('Invalid date range');
        }
        return undefined;
    }

    function hasError() : boolean {
        return error !== undefined;
    }

    return (
        <form onSubmit={handleSubmit} >
            <TextInput label={loc.get('Name')} value={budget.name} onChange={handleNameChange} required disabled={disabled}/>
            <TextInput label={loc.get('Start')} value={getISODateString(new Date(budget.from))} type='date' onChange={handleFromChange} error={hasError()} required  disabled={disabled}/>
            <TextInput label={loc.get('End')} value={getISODateString(new Date(budget.to))} type='date' error={hasError()} onChange={handleToChange} disabled={disabled}/>
            <AmountInput 
                disabled={disabled}
                onAmountChange={handleAmountChange}
                label={loc.get('Total')}
                amountInput={budget.total}
            />
            { store && <CurrencyInput 
                disabled={disabled}
                onCurrencyChange={handleCurrencyChange}
                selectedCurrency={budget.currency}
                currencies={currencies}
                valuesToTop={lastCurrenciesUsed}
            /> }
            <SaveButtonFab disabled={disabled || saveDisabled} color='primary' type='submit'/>
        </form>
    );
}