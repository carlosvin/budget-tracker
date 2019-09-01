import * as React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { useCategories } from "../../hooks/useCategories";
import { ExportForm } from "../../components/ExportForm";
import { ExportDataSet } from "../../interfaces";
import { CircularProgress } from "@material-ui/core";

interface ExportBudgetProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

export const ExportBudget: React.FC<ExportBudgetProps> = (props) => {

    const {budgetId} = props.match.params;
    const {onTitleChange} = props;
    const budgetModel = useBudgetModel(budgetId);
    const categories = useCategories();

    const [data, setData] = React.useState<ExportDataSet>();

    React.useEffect(() => {
        if (budgetModel && categories) {
            onTitleChange(`Export ${budgetModel.info.name}`);
            setData(budgetModel.export(categories));
        }
        return function () {
            onTitleChange('');
        } 
    // eslint-disable-next-line
    }, [budgetModel, categories]);

    if (data && budgetModel) {
        return <ExportForm fileName={budgetModel.info.name} data={data} />;   
    } else {
        return <CircularProgress />;
    }
}

export default ExportBudget;
