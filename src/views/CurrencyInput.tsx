import * as React from 'react';
import { currenciesStore } from '../stores/CurrenciesStore';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TextInput } from './TextInput';

interface CurrencyInputState {
    currencies: string[];
    selected?: string;
}

export interface CurrencyInputProps  {
    onCurrencyChange: (selected: string) => void;
    selectedCurrency?: string;
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
        this.setState({
            ...this.state,
            selected: event.target.value
        });
        if (this.props.onCurrencyChange) {
            this.props.onCurrencyChange(event.target.value);
        }
    }

    get selected () {
        return this.state.selected || this.props.selectedCurrency || this.state.currencies[0];
    }

    render() {
        if (this.state && this.state.currencies) {
            return (
                <TextInput
                    label='Currency'
                    select
                    SelectProps={{ native: true }}
                    onChange={this.handleChange}
                    value={this.selected}
                    required
                >
                { this.state.currencies.map(
                    (opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>))}}
                </TextInput>
            );
        }
        return <CircularProgress size='small'/>;
    }
}
