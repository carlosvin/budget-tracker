import * as React from 'react';
import { currenciesStore } from '../stores/CurrenciesStore';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TextInput } from './TextInput';

interface CurrencyInputState {
    currencies: { [key: string] : string};
    selected?: string;
}

export interface CurrencyInputProps  {
    onCurrencyChange: (selected: string) => void;
    selectedCurrency?: string;
}

export class CurrencyInput extends React.PureComponent<CurrencyInputProps, CurrencyInputState> {

    constructor(props: CurrencyInputProps) {
        super(props);
        this.state = {
            currencies: currenciesStore.getCurrencies()
        }
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
        return this.state.selected || this.props.selectedCurrency;
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
                    { Object.keys(this.state.currencies).map(
                        (k: string) => (
                            <option key={`currency-option-${k}`} value={k}>{this.state.currencies[k]}</option>))}
                </TextInput>
            );
        }
        return <CircularProgress size='small'/>;
    }
}
