import * as React from "react";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";
import { RouteComponentProps, Redirect } from "react-router";
import { budgetsStore } from '../../stores/BudgetsStore';
import { Budget } from "../../interfaces";
import { BudgetListItem } from "./BudgetListItem";
import { AddButton, ImportButton, SaveButton} from "../buttons";
import { BudgetUrl } from "../../utils";
import { TextInput } from "../TextInput";
import { string } from "prop-types";

interface ImportState {
    selectedFile?: File;
    processing?: boolean;
}

export class Import extends React.PureComponent<{},ImportState> {

    render() {
        return (
            <form>
                { 
                this.processing ? 
                    <CircularProgress /> :
                    <TextInput type='file' onChange={this.handleChange}/>
                }
                <SaveButton disabled={this.disabled} onClick={this.handleImport} />
            </form>);
    }



    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.setState({
            selectedFile: e.target.files[0]
        });
    }

    private handleImport = (e: React.SyntheticEvent) => {
        e.preventDefault();
        this.setState({
            processing: true
        });
        this.process();
    }

    private async process () {
        const content = await budgetsStore.importBudget(this.state.selectedFile);
        this.setState({
            processing: false
        });
    }

    private get disabled () {
        return  !this.state || 
                !this.state.selectedFile ||
                this.processing;
    }

    private get processing () {
        return this.state && this.state.processing;
    }
}
