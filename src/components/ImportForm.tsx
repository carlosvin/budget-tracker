import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FilesApi } from '../api/FileApi';
import {  ExportDataSet } from '../interfaces';
import { btApp } from '../BudgetTracker';
import { SaveButton } from './buttons/SaveButton';
import { SnackbarError } from './snackbars';

interface ImportFormProps {
    onImportedData: (data: Partial<ExportDataSet>) => void;
}

export const ImportForm: React.FC<ImportFormProps> = (props) => {

    const [selectedFile, setFile] = React.useState();
    const [isProcessing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState();

    React.useEffect(() => setError(undefined), [selectedFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setFile((event.target.files && event.target.files[0]) || undefined);
    }

    async function handleSubmit (e: React.FormEvent) {
        e.stopPropagation(); 
        e.preventDefault();
        if (selectedFile) {
            setProcessing(true);
            try {
                const serialized = await FilesApi.getFileContent(selectedFile);
                const data = JSON.parse(serialized) as ExportDataSet;
                const {budgets, expenses, categories} = data;
                await (await btApp.getCategoriesStore()).setCategories(categories);
                await (await btApp.getBudgetsStore()).import(budgets, expenses);    
                props.onImportedData(data);
                setFile(undefined);
            } catch (error) {
                console.error(error);
                setError('Invalid input format. Expected a JSON file with following format {budgets, categories, expenses}');
            }
            setProcessing(false);
        }
        return true;
    }

    return (
        <form onSubmit={handleSubmit}>
            { error && <SnackbarError message={error}/>}
            { isProcessing && <CircularProgress /> }
            <input 
                disabled={isProcessing} 
                type='file' 
                onChange={handleFileChange}
                required
                accept="application/json"
                />
            <SaveButton 
                disabled={!selectedFile || isProcessing} 
                type='submit'/>
        </form>);

}
