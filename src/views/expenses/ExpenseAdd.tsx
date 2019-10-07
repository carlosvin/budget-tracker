import * as React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { Expense } from "../../api";
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
import { useHeaderContext } from "../../hooks/useHeaderContext";

interface ExpenseViewProps extends HeaderNotifierProps,
    RouteComponentProps<{ budgetId: string }> { }

export const ExpenseAdd: React.FC<ExpenseViewProps> = (props) => {
    
    const currenciesStore = useCurrenciesStore();

    const {budgetId} = props.match.params;
    const {history} = props;
    
    const [currency, setCurrency] = React.useState();
    
    const budgetModel = useBudgetModel(budgetId);
    const currentCountry = useCurrentCountry();
    
    const budgetUrl = React.useMemo(() => (new BudgetPath(budgetId)), [budgetId]);

    const {identifier, now} = React.useMemo(() => ({
        identifier: uuid(), 
        now: Date.now()
    }), []);

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

    useHeaderContext('Add expense', <CloseButtonHistory history={history}/>, props);

    async function handleSubmit (expense: Expense) {
        goBack(
            props.history, 
            budgetUrl.pathExpensesByDay(DateDay.fromTimeMs(expense.when)));
        
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
                splitInDays={0}
                onSubmit={handleSubmit}
                />
        );
    } else {
        return <CircularProgress/>;
    }

   
}

export default ExpenseAdd;
