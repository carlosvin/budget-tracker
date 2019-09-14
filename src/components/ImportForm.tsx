import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FilesApi } from '../services/FileApi';
import {  ExportDataSet } from '../interfaces';
import { SnackbarError } from './snackbars';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import { useBudgetsStore } from '../hooks/useBudgetsStore';

interface ImportFormProps {
    onImportedData: (data: Partial<ExportDataSet>) => void;
}

export const ImportForm: React.FC<ImportFormProps> = (props) => {

    const [selectedFile, setFile] = React.useState();
    const [isProcessing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState();

    const budgetsStore = useBudgetsStore();

    React.useEffect(() => setError(undefined), [selectedFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setFile((event.target.files && event.target.files[0]) || undefined);
    }

    async function handleSubmit (e: React.FormEvent) {
        e.stopPropagation(); 
        e.preventDefault();
        if (selectedFile && budgetsStore) {
            setProcessing(true);
            try {
                const serialized = await FilesApi.getFileContent(selectedFile);
                const data = JSON.parse(serialized) as ExportDataSet;
                await budgetsStore.import(data);
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
            <IconButton color='primary' disabled={!selectedFile || isProcessing} type='submit'>
                <SaveIcon/>
            </IconButton>
        </form>);

}
