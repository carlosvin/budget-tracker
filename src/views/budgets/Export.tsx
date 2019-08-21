import * as React from "react";
import { RouteComponentProps } from "react-router";
import { AppButton } from "../../components/buttons/buttons";
import { HeaderNotifierProps } from "../../routes";
import CopyIcon from '@material-ui/icons/Code';
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { useCategories } from "../../hooks/useCategories";

interface ExportBudgetProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

export const ExportBudget: React.FC<ExportBudgetProps> = (props) => {

    const {budgetId} = props.match.params;
    const {onActions, onTitleChange} = props;
    const budgetModel = useBudgetModel(budgetId);
    const categories = useCategories();
    const [json, setJson] = React.useState<string>('Generating json...');

    React.useEffect(() => {
        function handleCopy() {
            navigator.clipboard.writeText(json);
        }

        if (budgetModel && categories) {
            onTitleChange(`Export ${budgetModel.info.name}`);
            onActions(
                <AppButton 
                    icon={CopyIcon} 
                    disabled={!budgetModel} 
                    aria-label='Copy JSON' 
                    onClick={handleCopy}/>);
            setJson(budgetModel.getJson(categories));
        }
    },
    // eslint-disable-next-line
    [budgetModel, categories]);

    React.useEffect(() => {
        function handleCopy() {
            navigator.clipboard.writeText(json);
        }
        onActions(
            <AppButton 
                icon={CopyIcon} 
                aria-label='Copy JSON' 
                onClick={handleCopy}/>);
    
        // eslint-disable-next-line
    }, [json]);

    return <pre style={{overflow: 'scroll', background: '#eee'}}>{json}</pre>
}

export default ExportBudget;