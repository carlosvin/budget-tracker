import * as React from "react";
import { RouteComponentProps } from "react-router";
import { AppButton } from "../../components/buttons/buttons";
import { HeaderNotifierProps } from "../../routes";
import FileCopy from '@material-ui/icons/FileCopy';
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { useCategories } from "../../hooks/useCategories";
import { BudgetModel } from "../../domain/BudgetModel";

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
        
        onActions([
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

    function url () {
        const blob = new Blob([json], { type: 'application/octet-stream' });
        return URL.createObjectURL(blob);
    }

    function fileName (budgetModel: BudgetModel) {
        return `${budgetModel.info.name}.json`;
    }
    
    return <React.Fragment>
        {budgetModel && <a href={url()} download={fileName(budgetModel)}>
            Download { fileName(budgetModel) }
        </a>}
        <pre style={{overflow: 'scroll', background: '#eee'}}>
            {json}
        </pre>
    </React.Fragment>;
}

export default ExportBudget;