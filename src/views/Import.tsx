import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { HeaderNotifierProps } from '../routes';
import { FilesApi } from '../api/FileApi';
import { Expense, Budget, Categories } from '../interfaces';
import { TextInput } from '../components/TextInput';
import { RouterProps } from 'react-router';
import { btApp } from '../BudgetTracker';
import { SaveButton } from '../components/buttons/SaveButton';
import { BudgetUrl } from '../domain/BudgetUrl';

const Import = (props: HeaderNotifierProps&RouterProps) => {

    const [selectedFile, setFile] = React.useState();
    const [isProcessing, setProcessing] = React.useState(false);

    React.useLayoutEffect(() => {
        props.onTitleChange('Import budget');
        return function () {
            props.onTitleChange('');
        }
    // eslint-disable-next-line
    }, []);

    React.useLayoutEffect(() => {
        props.onActions(
            <SaveButton 
                disabled={!selectedFile || isProcessing} 
                onClick={startProcess} />
        );
        return function () {
            props.onActions([]);
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
        setProcessing(true);
        const serialized = await FilesApi.getFileContent(selectedFile);
        const {expenses, info, categories} = JSON.parse(serialized) as ImportedStructure;
        const store = await btApp.getBudgetsStore();
        await store.setBudget(info);
        for (const id in expenses) {
            await store.setExpense(info.identifier, expenses[id]);
        }

        await (await btApp.getCategoriesStore()).setCategories(categories);
        
        setProcessing(false);
        props.history.replace(BudgetUrl.base);
    }

    const startProcess = () => {
        process();
        return true;
    }

    return (
        <form>
            { isProcessing && <CircularProgress /> }
            <TextInput 
                disabled={isProcessing} 
                type='file' 
                onChange={handleFileChange}
                />
        </form>);

}

export default Import;
