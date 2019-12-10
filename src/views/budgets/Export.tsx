import * as React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { useBudgetModel } from "../../hooks/useBudgetModel";
import { useCategories } from "../../hooks/useCategories";
import { ExportCard } from "../../components/ExportCard";
import { ExportDataSet } from "../../api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { CloseButtonHistory } from "../../components/buttons/CloseButton";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { useHeaderContext } from "../../hooks/useHeaderContext";
import { useLocalization } from "../../hooks/useLocalization";

interface ExportBudgetProps extends RouteComponentProps<{ budgetId: string }>, HeaderNotifierProps{}

export const ExportBudget: React.FC<ExportBudgetProps> = (props) => {

    const {budgetId} = props.match.params;
    const budgetPath = new BudgetPath(budgetId);
    const {onTitleChange, history} = props;
    const budgetModel = useBudgetModel(budgetId);
    const categories = useCategories();

    const [data, setData] = React.useState<ExportDataSet>();
    const loc = useLocalization();

    useHeaderContext(
        loc.get('Export'), 
        <CloseButtonHistory history={history} to={budgetPath.path}/>, props);

    React.useEffect(() => {
        if (budgetModel && categories) {
            onTitleChange(`${loc.get('Export')} ${budgetModel.info.name}`);
            setData(budgetModel.export(categories));
        }
    // eslint-disable-next-line
    }, [budgetModel, categories]);

    if (data && budgetModel) {
        return <ExportCard 
            fileName={budgetModel.info.name} 
            dataToExport={data}/>;   
    } else {
        return <CircularProgress />;
    }
}

export default ExportBudget;
