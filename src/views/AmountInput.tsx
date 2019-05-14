import * as React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";
import { CurrencyInput, CurrencyInputProps } from "./CurrencyInput";
import { TextInput } from "./TextInput";
import { Typography } from "@material-ui/core";
import { currenciesStore } from "../stores/CurrenciesStore";


interface AmountInputProps {
    label?: string;
    amount?: number;
    onAmountChange?: (amount: number) => void;
    helperText?: string;
}

interface AmountInputState {
    amount: string;
}

export class AmountInput extends React.PureComponent<AmountInputProps, AmountInputState> {

    constructor(props: AmountInputProps) {
        super(props);
        this.state = {amount: props.amount ? `${props.amount}` : ''};
    }

    private handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({amount: event.target.value});
        if (this.props.onAmountChange) {
            this.props.onAmountChange(parseFloat(event.target.value));
        }
    }
    
    render() {
        if (this.state) {
            return (
                <TextInput 
                    autoFocus
                    required
                    type='number'
                    label={this.props.label || 'Amount'}
                    value={this.state.amount}
                    inputProps={{ min: '0', step: '1', 'aria-required': true }}
                    onChange={this.handleAmountChange}
                    helperText={this.props.helperText}
                />
            );
        }
        return <CircularProgress />;
    }           
}

interface ExpenseAmountInputProps extends CurrencyInputProps, AmountInputProps {
    baseCurrency: string;
}

interface ExpenseAmountInputState {
    amountBaseCurrency?: number;
}

export class AmountWithCurrencyInput extends React.PureComponent<ExpenseAmountInputProps, ExpenseAmountInputState> {

    constructor(props: ExpenseAmountInputProps) {
        super(props);
        this.state = { };
    }

    render () {
        return (
            <Grid container direction='row' alignItems='baseline'>
                <Grid item>
                    <AmountInput {...this.props} onAmountChange={this.handleAmountChange} helperText={this.baseAmount}/>
                </Grid>
                <Grid item >
                    <CurrencyInput {...this.props} onCurrencyChange={this.handleCurrencyChange}/>
                </Grid>
            </Grid>);
    }

    get baseAmount () {
        if (this.isDifferentCurrency) {
            return `${this.state.amountBaseCurrency} ${this.props.baseCurrency}`;
        }
    }

    handleAmountChange = (amount: number) => {
        if (this.props.onAmountChange) {
            this.props.onAmountChange(amount);
        }
        if (this.isDifferentCurrency) {
            this.calculateBaseAmount();
        }
    }

    handleCurrencyChange = (currency: string) => {
        if (this.props.onCurrencyChange) {
            this.props.onCurrencyChange(currency);
        }
        if (this.isDifferentCurrency) {
            this.calculateBaseAmount();
        }
    }

    private async calculateBaseAmount () {
        const rate = await currenciesStore.getRate(
            this.props.baseCurrency, 
            this.props.selectedCurrency);
        if (rate) {
            this.setState({amountBaseCurrency: Math.round(this.props.amount *100 / rate) / 100 });
        }
    }

    get isDifferentCurrency () {
        return this.props.baseCurrency !== this.props.selectedCurrency;
    }
}
