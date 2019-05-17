import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { budgetsStore } from '../../stores/BudgetsStore';
import { TextInput } from "../TextInput";
import { SaveButton } from "../buttons";
import { TitleNotifierProps } from "src/interfaces";

const Import = (props: TitleNotifierProps) => {

    const [selectedFile, setFile] = React.useState();
    const [isProcessing, setProcessing] = React.useState(false);

    React.useEffect(() => {
        props.onTitleChange('Import budget');
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setFile(event.target.files && event.target.files[0] || undefined);
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
            <SaveButton 
                disabled={!selectedFile || isProcessing} 
                onClick={startProcess} />
        </form>);

}

export default Import;