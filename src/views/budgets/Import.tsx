import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { budgetsStore } from '../../stores/BudgetsStore';
import { TextInput } from "../../components/TextInput";
import { SaveButton } from "../../components/buttons";
import { HeaderNotifierProps } from '../../routes';

const Import = (props: HeaderNotifierProps) => {

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
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setFile((event.target.files && event.target.files[0]) || undefined);
    }

    const process = async () => {
        await budgetsStore.importBudget(selectedFile);
        setProcessing(false);
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