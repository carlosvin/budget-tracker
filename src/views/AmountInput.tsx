import * as React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";
import { CurrencyInput, CurrencyInputProps } from "./CurrencyInput";
import { TextInput } from "./TextInput";


interface AmountInputProps {
    label?: string;
    amount?: number;
    onAmountChange?: (amount: number)=> void;
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
                />
            );
        }
        return <CircularProgress />;
    }           
}

interface ExpenseAmountInputProps extends CurrencyInputProps, AmountInputProps {}

export class AmountWithCurrencyInput extends React.PureComponent<ExpenseAmountInputProps> {
    render () {
        return (
        <Grid container direction='row' alignItems='baseline'>
            <Grid item>
                <AmountInput {...this.props}/>
            </Grid>
            <Grid item >
                <CurrencyInput {...this.props} />
            </Grid>
        </Grid>);
    }
}
