import * as React from "react";
import { RouteComponentProps } from "react-router";
import { budgetsStore } from "../../stores/BudgetsStore";
import Grid from "@material-ui/core/Grid";
import { categoriesStore } from "../../stores/CategoriesStore";
import Link from '@material-ui/core/Link';
import { MyLink } from "../../components/MyLink";
import { BudgetUrl, getDateString, uuid } from "../../utils";
import { TextInput } from "../../components/TextInput";
import { countriesStore } from "../../stores/CountriesStore";
import { HeaderNotifierProps } from "../../routes";
import { SaveButtonFab, DeleteButton } from "../../components/buttons";
import CountryInput from "../../components/CountryInput";
import { currenciesStore } from "../../stores/CurrenciesStore";
import AmountWithCurrencyInput from "../../components/AmountWithCurrencyInput";
import { Category } from "../../interfaces";
import { CategoryFormDialog } from "../../components/CategoryFormDialog";


interface ExpenseViewProps extends HeaderNotifierProps,
    RouteComponentProps<{ budgetId: string; expenseId: string }> { }

export const ExpenseView: React.FC<ExpenseViewProps> = (props) => {

    const [categories, setCategories] = React.useState(
        Object.entries(categoriesStore.getCategories()));

    const [addCategoryOpen, setAddCategoryOpen] = React.useState(false);
    const [budget, setBudget] = React.useState();

    const [currency, setCurrency] = React.useState<string>();
    const [amount, setAmount] = React.useState<number>();
    const [countryCode, setCountryCode] = React.useState<string>('ES');
    const [dateString, setDateString] = React.useState(getDateString());
    const [identifier, setIdentifier] = React.useState(uuid());
    const [categoryId, setCategoryId] = React.useState(categories[0][0]);
    const [amountBaseCurrency, setAmountBaseCurrency] = React.useState<number>();
    const [description, setDescription] = React.useState<string>();

    const {budgetId, expenseId} = props.match.params;
    const {onActions, onTitleChange, history} = props;
    const {replace} = history;
    const budgetUrl = new BudgetUrl(budgetId);
    const isAddView = expenseId === undefined;

    React.useEffect(() => {
        const initBudget = async () => {
            const b = budgetsStore.getBudgetInfo(budgetId);
            setBudget(b);
            if (isAddView) {
                setCurrency(b.currency);
            }
        }
        initBudget();

        // eslint-disable-next-line
    }, [budgetId]);

    React.useEffect(() => {
        const handleDelete = () => {
            budgetsStore.deleteExpense(budgetId, expenseId);
            replace(budgetUrl.path);
        }

        const initAdd = async () => {
            onTitleChange(`Add expense`);
            const setCurrentCountry = async (currentCountry: string) => {
                setCountryCode(currentCountry);
                setCurrency(await currenciesStore.getFromCountry(currentCountry));
            }
            const currentCountry = countriesStore.currentCountryCode;
            setCurrentCountry(currentCountry);

            const currentCountryFetched = await countriesStore.getCurrentCountry();
            if (currentCountry !== currentCountryFetched) {
                setCurrentCountry(currentCountryFetched);
            }
        }
    
        const initEdit = async () => {
            onTitleChange(`Edit expense`);
            const e = await budgetsStore.getExpense(budgetId, expenseId);
            setAmount(e.amount);
            e.amountBaseCurrency && setAmountBaseCurrency(e.amountBaseCurrency);
            setCategoryId(e.categoryId);
            setCountryCode(e.countryCode);
            setCurrency(e.currency);
            setDescription(e.description);
            setDateString(getDateString(new Date(e.when)));
            setIdentifier(e.identifier);
        }

        if (isAddView) {
            initAdd();
        } else {
            initEdit();
        }
        onActions(<DeleteButton onClick={handleDelete}/>);

        return function () {
            onActions([]);
        }
        // eslint-disable-next-line
    }, [expenseId]);

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (amount && 
            categoryId && 
            currency && 
            countryCode && 
            identifier && 
            dateString && 
            amountBaseCurrency) {
            budgetsStore.setExpense(
                budgetId, 
                {   amount: amount, 
                    categoryId: categoryId,
                    currency: currency,
                    countryCode: countryCode,
                    identifier: identifier,
                    when: new Date(dateString).getTime(),
                    amountBaseCurrency: amountBaseCurrency,
                    description: description
                });
            props.history.replace(budgetUrl.path);
        } else {
            throw new Error(`Invalid expense data`);
        }
    }

    const CategoryOptions = React.useMemo(
        () => (categories.map(
            ([k, v]) => (
                <option key={`category-option-${k}`} value={v.id}>{v.name}</option>))), 
        [categories]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCategoryId(e.target.value);
    }

    const handleAddCategoryClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setAddCategoryOpen(true);
    }

    const handleAddCategoryClose = (category?: Category) => {
        if (category) {
            categoriesStore.setCategory(category);
            setCategories(Object.entries(categoriesStore.getCategories()));
            setCategoryId(category.id);
        }
        setAddCategoryOpen(false);
    }
    
    const CategoryInput = () => (
        <TextInput
            label='Category'
            onChange={handleCategoryChange}
            value={categoryId}
            helperText={
                <Link component={MyLink} onClick={handleAddCategoryClick}>Add category</Link>}
            select
            required 
            SelectProps={{ native: true }} >
            { CategoryOptions }
        </TextInput>
    );

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

    return (
        <React.Fragment>
            <CategoryFormDialog 
            open={addCategoryOpen} 
            onClose={handleAddCategoryClose} />
            <form onSubmit={handleSubmit} autoComplete='on'>
                <Grid container
                    justify='space-between'
                    alignItems='baseline'
                    alignContent='stretch'>
                    <Grid item >
                        { currency && <AmountWithCurrencyInput
                            amountInput={amount}
                            amountInBaseCurrency={amountBaseCurrency}
                            baseCurrency={budget && budget.currency}
                            selectedCurrency={currency}
                            onChange={handleAmountChange}
                        /> }
                    </Grid>
                    <Grid item >
                        <CategoryInput />
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
                </Grid>
                <SaveButtonFab type='submit' color='primary'/>
            </form>
        </React.Fragment>
        );
}

export default ExpenseView;
