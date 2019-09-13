import * as React from "react";
import { RouteComponentProps } from "react-router";
import Grid from "@material-ui/core/Grid";
import { getISODateString } from "../../domain/date";
import { TextInput } from "../../components/TextInput";
import { HeaderNotifierProps } from "../../routes";
import CountryInput from "../../components/CountryInput";
import AmountWithCurrencyInput from "../../components/AmountWithCurrencyInput";
import { CurrencyRates } from "../../interfaces";
import { btApp } from "../../BudgetTracker";
import CategoriesSelect from "../../components/categories/CategoriesSelect";
import { DeleteButton } from "../../components/buttons/DeleteButton";
import { SaveButtonFab } from "../../components/buttons/SaveButton";
import { goBack } from "../../domain/utils/goBack";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { DateDay } from "../../domain/DateDay";
import { round } from "../../domain/utils/round";
import { uuid } from "../../domain/utils/uuid";
import { BudgetModel } from "../../domain/BudgetModel";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { ExpenseModel } from "../../domain/ExpenseModel";

interface ExpenseViewProps extends HeaderNotifierProps,
    RouteComponentProps<{ budgetId: string; expenseId: string }> { }

export const ExpenseView: React.FC<ExpenseViewProps> = (props) => {

    const [error, setError] = React.useState<string|undefined>();

    const [currency, setCurrency] = React.useState<string|undefined>();
    const [amount, setAmount] = React.useState<number>();
    const [countryCode, setCountryCode] = React.useState<string|undefined>();
    const [dateString, setDateString] = React.useState(getISODateString());
    const [identifier, setIdentifier] = React.useState();
    const [categoryId, setCategoryId] = React.useState('');
    const [amountBaseCurrency, setAmountBaseCurrency] = React.useState<number>();
    const [baseCurrency, setBaseCurrency] = React.useState<string>();
    const [description, setDescription] = React.useState<string>();

    const [rates, setRates] = React.useState<CurrencyRates>();

    const [splitInDays, setSplitInDays] = React.useState<number|undefined>();

    const {budgetId, expenseId} = props.match.params;
    const {onActions, onTitleChange, history} = props;
    const {replace} = history;
    const budgetUrl = new BudgetPath(budgetId);
    const isAddView = expenseId === undefined;

    const budgetModel = useBudgetModel(budgetId);

    React.useEffect(
        () => {
            async function initCurrency () {
                const store = await btApp.getCurrenciesStore();
                let currencyFromCountry = store.lastCurrencyUsed;
                if (countryCode) {
                    currencyFromCountry = await store.getFromCountry(countryCode);
                }
                setCurrency(currencyFromCountry);
            }
            if (isAddView) {
                initCurrency();
            }

        },
    [countryCode, isAddView]);

    React.useEffect(()=> {
        async function initCountry () {
            const store = await btApp.getCountriesStore();
            if (!countryCode) {
                setCountryCode(store.currentCountryCode);
            }
        }

        async function handleDelete () {
            await (await btApp.getBudgetsStore()).deleteExpense(budgetId, expenseId);
            replace(budgetUrl.path);
        }
        initCountry();
        isAddView ? onTitleChange('Add expense'): onTitleChange('Edit expense');
        onActions(<DeleteButton onClick={handleDelete}/>);
        return function () {
            onActions(null); 
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {

        async function initRates (baseCurrency: string) {
            const store = await btApp.getCurrenciesStore();
            setRates(await store.getRates(baseCurrency));
        }
        
        function initBudget () {
            if (budgetModel) {
                setBaseCurrency(budgetModel.info.currency);
                initRates(budgetModel.info.currency);
                if (isAddView) {
                    initAdd();
                } else {
                    initEdit(budgetModel);
                }
            }
        }

        async function initAdd () {
            const countriesStore = await btApp.getCountriesStore();
            const currentCountryFetched = await countriesStore.getCurrentCountry();
            if (countryCode !== currentCountryFetched) {
                setCountryCode(currentCountryFetched);
            }
            if (currentCountryFetched) {
                const store = await btApp.getCurrenciesStore();

                const fetchedCurrency = await store.getFromCountry(currentCountryFetched);
                if (fetchedCurrency !== currency) {
                    setCurrency(fetchedCurrency);
                }
            } else {
                throw new Error('Fetched country is null');
            }
        }

        function initEdit (model: BudgetModel) {
            const e = model.getExpense(expenseId);
            setAmount(e.amount);
            e.amountBaseCurrency && setAmountBaseCurrency(e.amountBaseCurrency);
            setCategoryId(e.categoryId);
            setCountryCode(e.countryCode);
            setCurrency(e.currency);
            setDescription(e.description);
            setDateString(getISODateString(new Date(e.when)));
            setIdentifier(e.identifier);
        }
        
        initBudget();

        // eslint-disable-next-line
    }, [budgetModel, expenseId]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const max = splitInDays || 1;
        if (amount && amountBaseCurrency && currency && countryCode) {
            const date = new Date(dateString);
            const expenseModel = new ExpenseModel({
                identifier: identifier || uuid(), 
                amount,
                amountBaseCurrency, 
                currency,
                countryCode,
                categoryId,
                description,
                when: date.getTime(),
                budgetId
            });
            const store = await btApp.getBudgetsStore();
            const expenses = expenseModel.split(max).map(em => (em.info));
            await store.saveExpenses(budgetId, expenses);
            goBack(props.history, budgetUrl.pathExpensesByDay(new DateDay(date)));
        } else {
            throw new Error('Invalid expense data: Missing amount');
        }
    }
    
    const handleWhen = (e: React.ChangeEvent<HTMLInputElement>) => (
        setDateString(e.target.value)
    );

    const WhenInput = () => (
        <TextInput
            required
            label='When'
            type='date'
            value={ dateString }
            InputLabelProps={ {shrink: true,} }
            onChange={ handleWhen }
        />
    );

    const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setDescription(e.target.value);
    }

    const handleCountry = (countryCode: string) => (
        setCountryCode(countryCode)
    );

    const handleAmountChange = (amount: number, currency: string, amountBaseCurrency?:number) => {
        setCurrency(currency);
        setAmount(amount);
        setAmountBaseCurrency(amountBaseCurrency);
    }

    const handleSplitInDays = (e: React.ChangeEvent<HTMLInputElement>) => {
        const days = parseInt(e.target.value);
        setSplitInDays(days || undefined);
    }

    function amountPerDay () {
        if (amountBaseCurrency && baseCurrency && splitInDays && splitInDays > 1) {
            return `${round(amountBaseCurrency / splitInDays) } ${baseCurrency} per day`;
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
                        rates={ rates }
                        amountInput={amount}
                        amountInBaseCurrency={amountBaseCurrency}
                        selectedCurrency={currency}
                        onChange={handleAmountChange}
                        onError={setError}
                    /> }
                </Grid>
                <Grid item >
                    <CategoriesSelect onCategoryChange={setCategoryId} selectedCategory={categoryId}/>
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
                        label='Description' 
                        value={ description || '' }
                        onChange={ handleDescription } />
                </Grid>
                <Grid item>
                    <TextInput 
                        type='number'
                        label={'Split in days'}
                        value={ splitInDays }
                        helperText={ amountPerDay() }
                        onChange={ handleSplitInDays }
                        inputProps={ { min: 1 } }
                    />
                </Grid>
            </Grid>
            <SaveButtonFab type='submit' color='primary' disabled={error !== undefined}/>
        </form>
        );
}

export default ExpenseView;
