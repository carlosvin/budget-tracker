import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { getISODateString } from "../../domain/date";
import { TextInput } from "../../components/TextInput";
import CountryInput from "../../components/CountryInput";
import AmountWithCurrencyInput from "../../components/AmountWithCurrencyInput";
import { Expense } from "../../api";
import CategoriesSelect from "../../components/categories/CategoriesSelect";
import { SaveButtonFab } from "../../components/buttons/SaveButton";
import { ExpenseModel } from "../../domain/ExpenseModel";
import { useAppContext } from "../../contexts/AppContext";
import { getCurrencyWithSymbol } from "../../domain/utils/getCurrencyWithSymbol";
import { useLoc } from "../../hooks/useLoc";
import { useBudgetsIndex } from "../../hooks/useBudgetsIndex";

interface ExpenseFormProps extends Expense {
    baseCurrency: string;
    onSubmit: (expense: Expense) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = (props) => {

    const [error, setError] = React.useState<string|undefined>();

    const [currency, setCurrency] = React.useState<string>(props.currency);
    const [amount, setAmount] = React.useState<number>(props.amount);
    const [countryCode, setCountryCode] = React.useState<string>(props.countryCode);
    const [dateString, setDateString] = React.useState(getISODateString(new Date(props.when)));
    const [categoryId, setCategoryId] = React.useState(props.categoryId);
    const [amountBaseCurrency, setAmountBaseCurrency] = React.useState(props.amountBaseCurrency);
    const [description, setDescription] = React.useState(props.description);
    const [splitInDays, setSplitInDays] = React.useState<number|undefined>(props.splitInDays);
    const [budgetId, setBudgetId] = React.useState(props.budgetId);
    const budgets = useBudgetsIndex();

    const [modified, setModified] = React.useState(false);
    const btApp = useAppContext();
    const loc = useLoc();

    // For now only currency and country code might be updated from parent component
    React.useEffect(() => {
        setCurrency(props.currency);
        setCountryCode(props.countryCode);
    }, [props.currency, props.countryCode]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const max = splitInDays || 1;
        const date = new Date(dateString);
        const expenseModel = new ExpenseModel({
            identifier: props.identifier, 
            amount,
            amountBaseCurrency, 
            currency,
            countryCode,
            categoryId,
            description,
            when: date.getTime(),
            budgetId: budgetId,
            splitInDays: max
        });
        const store = await btApp.getBudgetsStore();
        await store.setExpenses(budgetId, [expenseModel]);
        (await btApp.getCurrenciesStore()).setLastCurrencyUsed(expenseModel.currency);
        props.onSubmit(expenseModel);
    }
    
    function handleWhen (e: React.ChangeEvent<HTMLInputElement>) {
        setDateString(e.target.value);
        setModified(true);
    }

    const WhenInput = () => (
        <TextInput
            required
            label={loc('When')}
            type='date'
            value={ dateString }
            InputLabelProps={ {shrink: true,} }
            onChange={ handleWhen }
        />
    );

    function handleDescription (e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setDescription(e.target.value);
        setModified(true);
    }

    function handleCountry (countryCode: string) {
        setCountryCode(countryCode);
        setModified(true);
    }

    function handleCategoryChanged (categoryId: string) {
        setCategoryId(categoryId);
        setModified(true);
    }

    function handleAmountChange(amountI: number, currencyI: string, amountBaseCurrencyI?:number) {
        setCurrency(currencyI);
        setAmount(amountI);
        setAmountBaseCurrency(amountBaseCurrencyI || 0);
        setModified(true);
    }

    function handleSplitInDays (e: React.ChangeEvent<HTMLInputElement>) {
        const days = parseInt(e.target.value);
        setSplitInDays(days || undefined);
        setModified(true);
    }

    function handleBudgetId(e: React.ChangeEvent<{ value: any }>) {
        setBudgetId(e.target.value);
        setModified(true);
    }

    function amountPerDay () {
        if (amountBaseCurrency && splitInDays && splitInDays > 1) {
            return `${getCurrencyWithSymbol(amountBaseCurrency / splitInDays, props.baseCurrency)} ${loc('per day')}`;
        }
        return undefined;
    }

    return (            
        <form onSubmit={handleSubmit} autoComplete='on'>
            <Grid container spacing={2} justify={'space-between'} alignItems='center'>
                <Grid item xs={12} sm={3}>
                    { currency && <AmountWithCurrencyInput
                        label={loc('Amount')}
                        baseCurrency={ props.baseCurrency }
                        amountInput={amount}
                        amountInBaseCurrency={amountBaseCurrency}
                        selectedCurrency={currency}
                        onChange={handleAmountChange}
                        onError={setError}
                    /> }
                </Grid>
                <Grid item xs={12} sm={3}>
                    <CategoriesSelect onCategoryChange={handleCategoryChanged} selectedCategory={categoryId}/>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <WhenInput />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextInput 
                        label={loc('Description')} 
                        value={ description || '' }
                        onChange={ handleDescription } />
                </Grid>
                <Grid item xs={12} sm={3}>
                    { countryCode && <CountryInput 
                        selected={ countryCode } 
                        onChange={ handleCountry }/>
                    }
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextInput 
                        type='number'
                        label={loc('Split in days')}
                        value={ splitInDays || '' }
                        helperText={ amountPerDay() }
                        onChange={ handleSplitInDays }
                        inputProps={ { min: 1 } }
                        disabled={ !amountBaseCurrency }
                    />
                </Grid>
                { budgets && <Grid item xs={6} sm={6}> 
                    <TextInput
                        label={loc('Move to')}
                        select
                        SelectProps={{ native: true }}
                        onChange={handleBudgetId}
                        value={budgetId}>
                        { budgets.map( b => (<option value={b.identifier}>{b.name}</option>)) }
                    </TextInput>
                </Grid> }
            </Grid>
            <SaveButtonFab type='submit' color='primary' disabled={error !== undefined || !modified}/>
        </form>
        );
}
