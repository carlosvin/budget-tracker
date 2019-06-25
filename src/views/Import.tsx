import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { HeaderNotifierProps } from '../routes';
import { SaveButton } from '../components/buttons';
import { budgetsStore } from '../stores/BudgetsStore';
import { FilesApi } from '../api/FileApi';
import { Expense, Budget } from '../interfaces';
import { TextInput } from '../components/TextInput';
import { RouterProps } from 'react-router';

const Import = (props: HeaderNotifierProps&RouterProps) => {

    const [selectedFile, setFile] = React.useState();
    const [isProcessing, setProcessing] = React.useState(false);

    React.useEffect(() => {
        props.onTitleChange('Import budget');
        props.onActions(
            <SaveButton 
                disabled={!selectedFile || isProcessing} 
                onClick={startProcess} />
        );
        return function () {
            props.onActions([]);
            props.onTitleChange('');
        }
    // eslint-disable-next-line
    }, [isProcessing, selectedFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setFile((event.target.files && event.target.files[0]) || undefined);
    }

    type ImportedStructure = {expenses: {[identifier: string]: Expense}, info: Budget};

    const process = async () => {
        const serialized = await FilesApi.getFileContent(selectedFile);
        const {expenses, info} = JSON.parse(serialized) as ImportedStructure;

        await budgetsStore.setBudget(info);
        for (const id in expenses) {
            await budgetsStore.setExpense(info.identifier, expenses[id]);
        }
        
        setProcessing(false);
        props.history.replace('/budgets');
    }

    const startProcess = () => {
        process();
        return true;
    }

    return (
        <form>
            { 
                isProcessing ? 
                    <CircularProgress /> :
                    <TextInput type='file' onChange={handleFileChange}/>
            }
        </form>);

}

export default Import;
