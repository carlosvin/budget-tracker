import * as React from "react";
import { RouteComponentProps } from "react-router";
import Grid from "@material-ui/core/Grid";
import { getDateString, uuid, round, convertToYMD } from "../../utils";
import { TextInput } from "../../components/TextInput";
import { HeaderNotifierProps } from "../../routes";
import CountryInput from "../../components/CountryInput";
import AmountWithCurrencyInput from "../../components/AmountWithCurrencyInput";
import { CurrencyRates, Expense } from "../../interfaces";
import { btApp } from "../../BudgetTracker";
import { DAY_MS } from "../../domain/BudgetModel";
import CategoriesSelect from "../../components/categories/CategoriesSelect";
import { DeleteButton } from "../../components/buttons/DeleteButton";
import { SaveButtonFab } from "../../components/buttons/SaveButton";
import { goBack } from "../../domain/utils/goBack";
import { BudgetUrl } from "../../domain/BudgetUrl";

interface ExpenseViewProps extends HeaderNotifierProps,
    RouteComponentProps<{ budgetId: string; expenseId: string }> { }

export const ExpenseView: React.FC<ExpenseViewProps> = (props) => {

    const [error, setError] = React.useState<string|undefined>();

    const [currency, setCurrency] = React.useState<string|undefined>(
        btApp.currenciesStore.lastCurrencyUsed);
    const [amount, setAmount] = React.useState<number>();
    const [countryCode, setCountryCode] = React.useState<string>(btApp.countriesStore.currentCountryCode);
    const [dateString, setDateString] = React.useState(getDateString());
    const [identifier, setIdentifier] = React.useState(uuid());
    const [categoryId, setCategoryId] = React.useState('');
    const [amountBaseCurrency, setAmountBaseCurrency] = React.useState<number>();
    const [baseCurrency, setBaseCurrency] = React.useState<string>();
    const [description, setDescription] = React.useState<string>();

    const [rates, setRates] = React.useState<CurrencyRates>();

    const [splitInDays, setSplitInDays] = React.useState<number|undefined>();

    const {budgetId, expenseId} = props.match.params;
    const {onActions, onTitleChange, history} = props;
    const {replace} = history;
    const budgetUrl = new BudgetUrl(budgetId);
    const isAddView = expenseId === undefined;

    React.useLayoutEffect(
        ()=> {
            async function handleDelete () {
                await btApp.budgetsStore.deleteExpense(budgetId, expenseId);
                replace(budgetUrl.path);
            }
            isAddView ? onTitleChange('Add expense'): onTitleChange('Edit expense');
            onActions(<DeleteButton onClick={handleDelete}/>);
        },
    // eslint-disable-next-line
    []);

    React.useEffect(() => {
        async function initRates (baseCurrency: string) {
            setRates(await btApp.currenciesStore.getRates(baseCurrency));
        }
        async function initBudget () {
            const b = await btApp.budgetsStore.getBudgetInfo(budgetId);
            setBaseCurrency(b.currency);
            initRates(b.currency);
            if (isAddView && !currency) {
                setCurrency(b.currency);
            }
        }

        async function initAdd () {
            const currentCountryFetched = await btApp.countriesStore.getCurrentCountry();
            if (countryCode !== currentCountryFetched) {
                setCountryCode(currentCountryFetched);
            }
            if (currentCountryFetched) {
                const fetchedCurrency = await btApp
                    .currenciesStore
                    .getFromCountry(currentCountryFetched);
                if (fetchedCurrency !== currency) {
                    setCurrency(fetchedCurrency);
                }
            } else {
                throw new Error('Fetched country is null');
            }
        }

        async function initEdit () {
            const model = await btApp.budgetsStore.getBudgetModel(budgetId);
            const e = model.getExpense(expenseId);
            setAmount(e.amount);
            e.amountBaseCurrency && setAmountBaseCurrency(e.amountBaseCurrency);
            setCategoryId(e.categoryId);
            setCountryCode(e.countryCode);
            setCurrency(e.currency);
            setDescription(e.description);
            setDateString(getDateString(new Date(e.when)));
            setIdentifier(e.identifier);
        }
        
        initBudget();
        if (isAddView) {
            initAdd();
        } else {
            initEdit();
        }
        return function () {
            onActions([]);
        }

        // eslint-disable-next-line
    }, [budgetId, expenseId]);

    function createExpense (
        dayNumber: number, 
        inputAmount: number, 
        inputAmountBase: number, 
        timeMs: number): Expense {
        if (currency) {
            return {   
                amount: inputAmount, 
                categoryId,
                currency,
                countryCode,
                identifier: isAddView ? identifier + dayNumber : identifier,
                when: timeMs + (DAY_MS * dayNumber),
                amountBaseCurrency: inputAmountBase,
                description
            };
        }
        throw new Error(`Invalid expense data: Currency is missing`);
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const max = splitInDays || 1;
        if (amount && amountBaseCurrency) {
            const inputAmount = amount / max;
            const inputAmountBase = amountBaseCurrency / max;
            const date = new Date(dateString);
            let firstExpenseId = undefined;
            for (let i=0; i < max; i++) {
                const expense = createExpense(i, inputAmount, inputAmountBase, date.getTime());
                if (!firstExpenseId) {
                    firstExpenseId = expense.identifier;
                }
                await btApp.budgetsStore.setExpense(
                        budgetId,
                        expense);
            }
            goBack(props.history, budgetUrl.pathExpensesByDay(convertToYMD(date)));
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
        <React.Fragment>
            
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
                        <CountryInput 
                            selectedCountry={ countryCode } 
                            onCountryChange={ handleCountry }/>
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
        </React.Fragment>
        );
}

export default ExpenseView;
