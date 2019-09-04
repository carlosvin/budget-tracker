import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FilesApi } from '../api/FileApi';
import {  ExportDataSet } from '../interfaces';
import { SnackbarError } from './snackbars';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import { useStorage } from '../hooks/useStorage';

interface ImportFormProps {
    onImportedData: (data: Partial<ExportDataSet>) => void;
}

export const ImportForm: React.FC<ImportFormProps> = (props) => {

    const [selectedFile, setFile] = React.useState();
    const [isProcessing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState();
    const storage = useStorage();

    React.useEffect(() => setError(undefined), [selectedFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setFile((event.target.files && event.target.files[0]) || undefined);
    }

    async function handleSubmit (e: React.FormEvent) {
        e.stopPropagation(); 
        e.preventDefault();
        if (!storage) {
            throw Error('Storage is not loaded');
        }
        if (selectedFile) {
            setProcessing(true);
            try {
                const serialized = await FilesApi.getFileContent(selectedFile);
                const data = JSON.parse(serialized) as ExportDataSet;
                await storage.import(data);
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
