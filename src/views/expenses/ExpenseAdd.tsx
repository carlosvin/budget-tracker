import * as React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { Expense } from "../../interfaces";
import { goBack } from "../../domain/utils/goBack";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { DateDay } from "../../domain/DateDay";
import { uuid } from "../../domain/utils/uuid";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { useCurrentCountry } from "../../hooks/useCurrentCountry";
import { CloseButtonHistory } from "../../components/buttons/CloseButton";
import { ExpenseForm } from "../../components/expenses/ExpenseForm";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useCurrenciesStore } from "../../hooks/useCurrenciesStore";
import { CurrenciesStore } from "../../domain/stores/interfaces";

interface ExpenseViewProps extends HeaderNotifierProps,
    RouteComponentProps<{ budgetId: string }> { }

export const ExpenseAdd: React.FC<ExpenseViewProps> = (props) => {
    
    const currenciesStore = useCurrenciesStore();

    const {budgetId} = props.match.params;
    const {onActions, onTitleChange, history} = props;
    const budgetUrl = new BudgetPath(budgetId);
    
    const [currency, setCurrency] = React.useState();
    
    const budgetModel = useBudgetModel(budgetId);
    const currentCountry = useCurrentCountry();
    
    // TODO these should be called only once
    const identifier = uuid();
    const now = Date.now();

    React.useEffect(() => {
        async function initCurrency (country: string, store: CurrenciesStore) {
            const currencyFromCountry = await store.getFromCountry(country);
            if (currencyFromCountry) {
                setCurrency(currencyFromCountry);
            }
        }
        if (currentCountry && currenciesStore) {
            initCurrency(currentCountry, currenciesStore);
        }
    }, [currentCountry, currenciesStore]);

    React.useEffect(() => {
        async function initCurrency (store: CurrenciesStore) {
            const lastCurrency = store.lastCurrencyUsed;
            if (lastCurrency && lastCurrency !== currency) {
                setCurrency(lastCurrency);
            }
        }
        if (currenciesStore) {
            initCurrency(currenciesStore);
        }
        // eslint-disable-next-line
    }, [currenciesStore]);

    React.useEffect(() => {
        if (budgetModel && currency === undefined) {
            setCurrency(budgetModel.info.currency);
        }
    }, [budgetModel, currency]);

    React.useEffect(()=> {
        onTitleChange('Add expense');
        onActions([<CloseButtonHistory history={history} key='close-button'/>]);
        return function () {
            onActions(null); 
        }
        // eslint-disable-next-line
    }, []);

    async function handleSubmit (expenses: Expense[]) {
        goBack(
            props.history, 
            budgetUrl.pathExpensesByDay(DateDay.fromTimeMs(expenses[0].when)));
        
    }

    if (budgetModel) {
        return (
            <ExpenseForm
                amount={0}
                amountBaseCurrency={0}
                budgetId={budgetId}
                categoryId={''}
                identifier={identifier}
                baseCurrency={budgetModel.info.currency} 
                countryCode={currentCountry || 'ES'}
                currency={currency}
                when={now}
                onSubmit={handleSubmit}
                />
        );
    } else {
        return <CircularProgress/>;
    }

   
}

export default ExpenseAdd;
