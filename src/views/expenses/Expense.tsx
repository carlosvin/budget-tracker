import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Expense } from "../../interfaces";
import { budgetsStore } from "../../stores/BudgetsStore";
import Grid from "@material-ui/core/Grid";
import { categoriesStore } from "../../stores/CategoriesStore";
import Link from '@material-ui/core/Link';
import { MyLink } from "../MyLink";
import { BudgetUrl, getDateString, uuid } from "../../utils";
import AmountWithCurrencyInput from "../AmountInput";
import { TextInput } from "../TextInput";
import { countriesStore } from "../../stores/CountriesStore";
import { HeaderNotifierProps } from "../../routes";
import { SaveButtonFab, DeleteButton } from "../buttons";
import CountryInput from "../CountryInput";


interface ExpenseViewProps extends HeaderNotifierProps,
    RouteComponentProps<{ budgetId: string; expenseId: string }> { }

export const ExpenseView: React.FC<ExpenseViewProps> = (props) => {

    const categories = Object.entries(categoriesStore.getCategories());

    const [budget, setBudget] = React.useState();
    const [expense, setExpense] = React.useState<Partial<Expense>>({
        currency: 'EUR',
        categoryId: categories[0][0],
        identifier: uuid(),
        when: new Date().getTime()
    });

    const [dateString, setDateString] = React.useState(getDateString());

    const {budgetId, expenseId} = props.match.params;
    const {onActions, onTitleChange, history} = props;
    const {replace} = history;
    const budgetUrl = new BudgetUrl(budgetId);
    const isAddView = expenseId === undefined;

    React.useEffect(() => {
        const initBudget = async () => {
            const b = await budgetsStore.getBudget(budgetId);
            setBudget(b);
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
            const currentCountry =  await countriesStore.getCurrentCountry();
            setExpense({...expense, countryCode: currentCountry});
        }
    
        const initEdit = async () => {
            onTitleChange(`Edit expense`);
            const e = await budgetsStore.getExpense(budgetId, expenseId);
            setExpense(e);
            setDateString(getDateString(new Date(e.when)));
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
        if (expense.amount && 
            expense.categoryId && 
            expense.currency && 
            expense.countryCode && 
            expense.identifier) {
            budgetsStore.saveExpense(
                budgetId, 
                {   ...expense, 
                    amount: expense.amount, 
                    categoryId: expense.categoryId,
                    currency: expense.currency,
                    countryCode: expense.countryCode,
                    identifier: expense.identifier,
                    when: new Date(dateString).getTime()
                });
            props.history.replace(budgetUrl.path);
        } else {
            throw new Error(`Invalid expense data: ${expense}`);
        }
        
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => (
        setExpense({...expense, categoryId: e.target.value})
    );
    
    const CategoryInput = () => (
        <TextInput
            label='Category'
            onChange={handleCategoryChange}
            value={expense.categoryId}
            helperText={<Link component={MyLink} href='/categories/add'>Add category</Link>}
            select
            required 
            SelectProps={{ native: true }} >
            {categories.map(
                ([k, v]) => (
                    <option key={`category-option-${k}`} value={v.id}>{v.name}</option>))}
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

    const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => (
        setExpense({...expense, description: e.target.value})
    );

    const handleCountry = (countryCode: string) => (
        setExpense({...expense, countryCode})
    );

    const handleAmountChange = (amount: number, currency: string, amountBaseCurrency?:number) => (
        setExpense({...expense, amount, currency, amountBaseCurrency})
    );

    return (
        <form onSubmit={handleSubmit}>
            <Grid container
                justify='space-between'
                alignItems='baseline'
                alignContent='stretch'>
                <Grid item >
                    <AmountWithCurrencyInput 
                        amountInput={expense.amount}
                        amountInBaseCurrency={expense.amountBaseCurrency}
                        baseCurrency={budget && budget.currency}
                        selectedCurrency={expense.currency}
                        onChange={handleAmountChange}
                    />
                </Grid>
                <Grid item >
                    <CategoryInput />
                </Grid>
                <Grid item>
                    <WhenInput />
                </Grid>
                { expense.countryCode && <Grid item>
                    <CountryInput 
                        selectedCountry={ expense.countryCode } 
                        onCountryChange={ handleCountry }/>
                </Grid> }
                <Grid item >
                    <TextInput 
                        label='Description' 
                        value={ expense.description || '' }
                        onChange={ handleDescription } />
                </Grid>
            </Grid>
            <SaveButtonFab type='submit' color='primary'/>
        </form>);
}

export default ExpenseView;
