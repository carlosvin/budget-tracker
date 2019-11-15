import * as React from "react";
import { RouteComponentProps } from "react-router";
import { HeaderNotifierProps } from "../../routes";
import { AddButton } from "../../components/buttons/AddButton";
import { ImportExportButton } from "../../components/buttons/ImportExportButton";
import { BudgetPath } from "../../domain/paths/BudgetPath";
import { AppPaths } from "../../domain/paths";

import { useBudgetsIndex } from "../../hooks/useBudgetsIndex";
import { CloseButton } from "../../components/buttons/CloseButton";
import MergeIcon from '@material-ui/icons/MergeType';

import { ButtonFab } from "../../components/buttons/buttons";
import { useLoc } from "../../hooks/useLoc";
import { BudgetsList as BudgetsListComponent } from "../../components/budgets/BudgetsList";
import { BudgetsListEmpty } from "../../components/budgets/BudgetsListEmpty";


interface BudgetListProps extends RouteComponentProps, HeaderNotifierProps {}

export const BudgetList: React.FC<BudgetListProps> = (props) => {

    const budgets = useBudgetsIndex();
    const [selectedBudgets, setSelectedBudgets] = React.useState(new Set<string>());
    const loc = useLoc();
    
    React.useEffect(() => {
        props.onTitleChange(loc('Budget list'));
    // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        function handleUnselectAll () {
            setSelectedBudgets(new Set());
        }

        if (selectedBudgets.size === 0) {
            props.onTitleChange(loc('Budget list'));
            props.onActions([ 
                <AddButton to={BudgetPath.add} key='add-budget'/>, 
                <ImportExportButton to={AppPaths.ImportExport} key='import-export-data'/>
            ]);
        } else {
            props.onTitleChange(loc('Selecting budgets'));
            props.onActions([
                <ButtonFab 
                    to={BudgetPath.pathCombinedWithQuery(selectedBudgets)}
                    disabled={selectedBudgets.size < 2} key='combine-budgets-button' >
                    <MergeIcon/>
                </ButtonFab>,
                <CloseButton onClick={handleUnselectAll} key='close-button'/>]);
        }
        return function () {
            props.onActions([]);
        };
    // eslint-disable-next-line
    }, [selectedBudgets]);

    if (budgets === undefined) {
        return null;
    }
    if (budgets.length > 0) {
        return <BudgetsListComponent 
            budgets={[...budgets]} 
            selected={selectedBudgets} 
            onSelected={setSelectedBudgets}/>;
    } else {
        return <BudgetsListEmpty loc={loc}/>;
    }
}

export default BudgetList;
