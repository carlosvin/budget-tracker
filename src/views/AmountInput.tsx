import * as React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";
import { CurrencyInput, CurrencyInputProps } from "./CurrencyInput";
import { TextInput } from "./TextInput";
import { currenciesStore } from "../stores/CurrenciesStore";
import { round } from "../utils";


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

interface AmountCurrencyInputProps extends CurrencyInputProps, AmountInputProps {
    baseCurrency: string;
    amountInBaseCurrency?: number;
    onAmountInBaseCurrencyChange?: (amount: number) => void;
}

interface AmountCurrencyInputState {
    amountInBaseCurrency?: number;
}

export class AmountWithCurrencyInput extends React.PureComponent<AmountCurrencyInputProps, AmountCurrencyInputState> {

    constructor(props: AmountCurrencyInputProps) {
        super(props);
        this.state = { amountInBaseCurrency: props.amountInBaseCurrency };
        if (props.amountInBaseCurrency && AmountWithCurrencyInput.isDifferentCurrency(props)) {
            this.calculateAmountInBaseCurrency(props.amount, props.selectedCurrency);
        }
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
        if (this.isDifferentCurrency && this.state.amountInBaseCurrency) {
            return `${this.state.amountInBaseCurrency} ${this.props.baseCurrency}`;
        }
    }

    handleAmountChange = (amount: number) => {
        if (this.props.onAmountChange) {
            this.props.onAmountChange(amount);
        }
        if (this.isDifferentCurrency) {
            this.calculateAmountInBaseCurrency(amount, this.props.selectedCurrency);
        }
    }

    handleCurrencyChange = (currency: string) => {
        if (this.props.onCurrencyChange) {
            this.props.onCurrencyChange(currency);
        }
        if (this.isDifferentCurrency) {
            this.calculateAmountInBaseCurrency(this.props.amount, currency);
        }
    }

    private async calculateAmountInBaseCurrency (amount: number, currency: string) {
        const amountInBaseCurrency = await currenciesStore.getAmountInBaseCurrency(
            this.props.baseCurrency, 
            currency,
            amount);
        this.setState({amountInBaseCurrency: round(amountInBaseCurrency)});

        if (this.props.onAmountInBaseCurrencyChange) {
            this.props.onAmountInBaseCurrencyChange(amountInBaseCurrency);
        }
    }

    get isDifferentCurrency () {
        return AmountWithCurrencyInput.isDifferentCurrency(this.props);
    }

    static isDifferentCurrency (props: AmountCurrencyInputProps) {
        return props.baseCurrency && props.baseCurrency !== props.selectedCurrency;
    }
}
