import * as React from "react";
import { RouteComponentProps } from "react-router";
import { AppButton } from "../../components/buttons/buttons";
import { HeaderNotifierProps } from "../../routes";
import FileCopy from '@material-ui/icons/FileCopy';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { useCategories } from "../../hooks/useCategories";
import { btApp } from "../../BudgetTracker";

/** TODO we might want to add popup export to allow to download a file
 * 
 * async function handleExport() {
        if (budgetModel){
            const store  = await btApp.getCategoriesStore();
            const categories = await store.getCategories();
            const json = budgetModel.getJson(categories);
            window.open(
                'data:application/octet-stream,' +
                encodeURIComponent(json));
        }
    }
*/

interface ExportBudgetProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

export const ExportBudget: React.FC<ExportBudgetProps> = (props) => {

    const {budgetId} = props.match.params;
    const {onActions, onTitleChange} = props;
    const budgetModel = useBudgetModel(budgetId);
    const categories = useCategories();
    const [json, setJson] = React.useState<string>('Generating json...');

    React.useEffect(() => {
        if (budgetModel && categories) {
            onTitleChange(`Export ${budgetModel.info.name}`);
            setJson(budgetModel.getJson(categories));
        }
        return function () {
            onTitleChange('');
        } 
    // eslint-disable-next-line
    }, [budgetModel, categories]);

    

    React.useEffect(() => {
        function handleCopy() {
            navigator.clipboard.writeText(json);
        }
        async function handleDownload () {
            if (budgetModel){
                const store  = await btApp.getCategoriesStore();
                const categories = await store.getCategories();
                const json = budgetModel.getJson(categories);
                window.open(
                    'data:application/octet-stream,' +
                    encodeURIComponent(json));
            }
        }
        onActions([
            <AppButton 
                icon={DownloadIcon} 
                aria-label='Download' 
                onClick={handleDownload} key='export-download-file'/>,
            <AppButton key='export-copy-to-clipboard'
                icon={FileCopy} 
                aria-label='Copy JSON' 
                onClick={handleCopy}/>
        ]);
        return function () {
            onActions(undefined);
        }
        // eslint-disable-next-line
    }, [json]);

    return <pre style={{overflow: 'scroll', background: '#eee'}}>{json}</pre>
}

export default ExportBudget;