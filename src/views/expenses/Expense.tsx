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
    const [expense, setExpense] = React.useState<Expense>({
        currency: 'EUR',
        amount: 0,
        categoryId: categories[0][0],
        countryCode: '',
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
        const handleDelete = () => {
            budgetsStore.deleteExpense(budgetId, expenseId);
            replace(budgetUrl.path);
        }

        const initAdd = async () => {
            onTitleChange(`Add expense`);
            const [b, c] =  await Promise.all([
                budgetsStore.getBudget(budgetId), 
                countriesStore.getCurrentCountry(),
            ]);
            setBudget(b);
            setExpense({...expense, currency: b.currency, countryCode: c});
        }
    
        const initEdit = async () => {
            onTitleChange(`Edit expense`);
            const [b, e] = await Promise.all([
                budgetsStore.getBudget(budgetId),
                budgetsStore.getExpense(budgetId, expenseId),
            ]);
            setBudget(b);
            setExpense(e);
            setDateString(getDateString(new Date(e.when)));
        }

        onActions(<DeleteButton onClick={handleDelete}/>);
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

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        budgetsStore.saveExpense(budgetId, {...expense, when: new Date(dateString).getTime()});
        props.history.replace(budgetUrl.path);
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
                <Grid item>
                    <CountryInput selectedCountry={ expense.countryCode } onCountryChange={ handleCountry }/>
                </Grid>
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
