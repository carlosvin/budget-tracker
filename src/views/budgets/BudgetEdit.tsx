import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Budget, TitleNotifierProps } from "../../interfaces";
import { budgetsStore } from "../../stores/BudgetsStore";
import CircularProgress from '@material-ui/core/CircularProgress';
import { BudgetUrl, getDateString, goBack, uuid } from "../../utils";
import Grid from "@material-ui/core/Grid";
import { SaveButton, CancelButton } from "../buttons";
import { AmountWithCurrencyInput } from "../AmountInput";
import { TextInput } from "../TextInput";

interface BudgetEditProps extends RouteComponentProps<{ budgetId: string }>, TitleNotifierProps{
}

interface BudgetViewState extends Budget {
    start: string;
    end: string;
    error?: string;
}

export class BudgetEdit extends React.PureComponent<BudgetEditProps, BudgetViewState> {
    // TODO handle errors on type and on submit

    private readonly url: BudgetUrl;
    
    constructor(props: BudgetEditProps){
        super(props);
        if (props.match.params.budgetId) {
            this.initBudget(props.match.params.budgetId);
            this.url = new BudgetUrl(props.match.params.budgetId);
        } else {
            props.onTitleChange('New budget');
            const now = new Date();
            this.state = {
                currency: 'EUR',
                from: now.getTime(),
                to: now.getTime(),
                start: getDateString(now),
                end: getDateString(now),
                identifier: uuid(),
                name: '',
                total: 0 
            };
            this.url = new BudgetUrl(this.state.identifier);
        }
    }

    private async initBudget(identifier: string) {
        try {
            const info = await budgetsStore.getBudget(identifier);
            if (info) {
                this.setState({ 
                    ...info, 
                    start: getDateString(new Date(info.from)), 
                    end: getDateString(new Date(info.to)), 
                });
                this.props.onTitleChange(`Edit ${info.name}`);
            }
        } catch (e) {
            console.error(e);
        }
    }

    // TODO unify handling using type as argument. I have to research how to do it in TS
    handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            error: undefined,
            [name]: event.target.value
        });
    }

    private handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const budget: Budget = {
            ...this.state,
            to: new Date(this.state.end).getTime(),
            from: new Date(this.state.start).getTime()
        };
        const error = this.validate(budget);
        if (error) {
            this.setState({error});
        } else {
            budgetsStore.setBudget(budget);
            this.props.history.replace(this.url.path);
        }
        
    }

    private validate (budget: Budget) {
        if (budget.from >= budget.to) {
            return 'Invalid date range';
        }
        return null;
    }

    private close = () => {
        goBack(this.props.history);
    }

    private Actions = () => (
        <Grid container direction='row' justify='space-evenly'>
            <SaveButton type='submit'/>
            <CancelButton onClick={this.close} />
        </Grid>
    );

    get hasError () {
        return this.state.error!==undefined;
    }

    render() {
        if (this.state) {
            return (
                <form onSubmit={this.handleSubmit}>
                    <TextInput label='Name' value={this.state.name} onChange={this.handleChange('name')} required />
                    <TextInput label='Start' value={this.state.start} type='date' onChange={this.handleChange('start')} error={this.hasError} required/>
                    <TextInput label='End' value={this.state.end} type='date' error={this.hasError} onChange={this.handleChange('end')}/>
                    <AmountWithCurrencyInput 
                        onAmountChange={this.handleAmountChange}
                        onCurrencyChange={this.handleCurrencyChange}
                        amount={this.state.total}
                        selectedCurrency={this.state.currency}
                        label='Total'
                    />
                    <this.Actions />
                </form>
            );
        }
        return <CircularProgress/>;
    }

    private handleCurrencyChange = (currency: string) => (
        this.setState({ currency })
    );

    private handleAmountChange = (total: number) => (
        this.setState({ total })
    );
}
