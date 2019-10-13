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
import { useRates } from "../../hooks/useRates";
import { useAppContext } from "../../contexts/AppContext";
import { getCurrencyWithSymbol } from "../../domain/utils/getCurrencyWithSymbol";
import { useLoc } from "../../hooks/useLoc";

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

    const [modified, setModified] = React.useState(false);
    const btApp = useAppContext();
    const loc = useLoc();

    // For now only currency and country code might be updated from parent component
    React.useEffect(() => {
        setCurrency(props.currency);
        setCountryCode(props.countryCode);
    }, [props.currency, props.countryCode]);

    const rates = useRates(props.baseCurrency);

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
            budgetId: props.budgetId,
            splitInDays: max
        });
        const store = await btApp.getBudgetsStore();
        await store.setExpenses(props.budgetId, [expenseModel]);
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

    function amountPerDay () {
        if (amountBaseCurrency && splitInDays && splitInDays > 1) {
            return `${getCurrencyWithSymbol(amountBaseCurrency / splitInDays, props.baseCurrency)} ${loc('per day')}`;
        }
        return undefined;
    }

    return (            
        <form onSubmit={handleSubmit} autoComplete='on'>
            <Grid container
                justify='space-between'
                alignItems='baseline'
                alignContent='stretch'>
                <Grid item >
                    { rates && currency && <AmountWithCurrencyInput
                        label={loc('Amount')}
                        rates={ rates }
                        amountInput={amount}
                        amountInBaseCurrency={amountBaseCurrency}
                        selectedCurrency={currency}
                        onChange={handleAmountChange}
                        onError={setError}
                    /> }
                </Grid>
                <Grid item >
                    <CategoriesSelect onCategoryChange={handleCategoryChanged} selectedCategory={categoryId}/>
                </Grid>
                <Grid item>
                    <WhenInput />
                </Grid>
                <Grid item>
                    { countryCode && <CountryInput 
                        selectedCountry={ countryCode } 
                        onCountryChange={ handleCountry }/>
                    }
                </Grid>
                <Grid item >
                    <TextInput 
                        label={loc('Description')} 
                        value={ description || '' }
                        onChange={ handleDescription } />
                </Grid>
                <Grid item>
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
            </Grid>
            <SaveButtonFab type='submit' color='primary' disabled={error !== undefined || !modified}/>
        </form>
        );
}
