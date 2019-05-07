import * as React from 'react';
import TextField from "@material-ui/core/TextField";
import { currenciesStore } from '../stores/CurrenciesStore';
import { CircularProgress } from '@material-ui/core';

interface CurrencyInputState {
    currencies: string[];
    selected?: string;
}

interface CurrencyInputProps  {
    onCurrencyChange: (selected: string) => void;
}

export class CurrencyInput extends React.PureComponent<CurrencyInputProps, CurrencyInputState> {

    constructor(props: CurrencyInputProps){
        super(props);
        this.initCurrencies();
    }

    private async initCurrencies () {
        const currencies = await currenciesStore.getCurrencies();
        this.setState({
            currencies
        });
    }

    private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(this.state);
        this.setState({
            ...this.state,
            selected: event.target.value
        });
        if (this.props.onCurrencyChange) {
            this.props.onCurrencyChange(event.target.value);
        }
    }

    render() {
        if (this.state && this.state.currencies) {
            return (
                <TextField
                    id='currencies-input-select'
                    label='Currency'
                    style={{ margin: 8 }}
                    margin='dense'  
                    select
                    SelectProps={{ native: true }}
                    onChange={this.handleChange}
                    value={this.state.selected || this.state.currencies[0]}
                >
                { this.state.currencies.map(
                    (opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>))}}
                </TextField>
            );
        }
        return <CircularProgress size='small'/>;
    }
}
