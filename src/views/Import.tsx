import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { HeaderNotifierProps } from '../routes';
import { SaveButton } from '../components/buttons';
import { FilesApi } from '../api/FileApi';
import { Expense, Budget, Categories } from '../interfaces';
import { TextInput } from '../components/TextInput';
import { RouterProps } from 'react-router';
import { btApp } from '..';

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

    type ImportedStructure = {
        expenses: {[identifier: string]: Expense}, 
        info: Budget,
        categories: Categories
    };

    const process = async () => {
        const serialized = await FilesApi.getFileContent(selectedFile);
        const {expenses, info, categories} = JSON.parse(serialized) as ImportedStructure;

        await btApp.budgetsStore.setBudget(info);
        for (const id in expenses) {
            await btApp.budgetsStore.setExpense(info.identifier, expenses[id]);
        }

        btApp.categoriesStore.setCategories(categories);
        
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
