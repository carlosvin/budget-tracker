import * as React from 'react';
import { currenciesStore } from '../stores/CurrenciesStore';
import { TextInput } from './TextInput';

export interface CurrencyInputProps  {
    onCurrencyChange: (selected: string) => void;
    selectedCurrency?: string;
    disabled?: boolean;
}

interface CurrencyInputState {
    currencies: { [currency: string]: string};
    selected?: string;
}

export class CurrencyInput extends React.PureComponent<CurrencyInputProps, CurrencyInputState> {

    constructor(props: CurrencyInputProps) {
        super(props);
        this.state = {
            currencies: {}, 
            selected: props.selectedCurrency};
        this.initCurrencies();
    }

    static getDerivedStateFromProps(nextProps: CurrencyInputProps, prevState: CurrencyInputState){
        return {selected: nextProps.selectedCurrency || prevState.selected };
    }

    private async initCurrencies () {
        this.setState ({
            ...this.state,
            currencies: await currenciesStore.getCurrencies()
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
                    disabled={this.props.disabled}
                >
                    { Object.keys(this.state.currencies).map(
                        (k: string) => (
                            <option key={`currency-option-${k}`} value={k}>{this.state.currencies[k]}</option>))}
                </TextInput>
            );
        }
        return null;
    }
}
