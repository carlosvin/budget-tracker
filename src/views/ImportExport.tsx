import * as React from 'react';
import { HeaderNotifierProps } from '../routes';
import { RouterProps } from 'react-router';
import { ExportDataSet } from '../api';
import { ExportCard } from '../components/ExportCard';
import { CloseButtonHistory } from '../components/buttons/CloseButton';
import { useBudgetsStore } from '../hooks/useBudgetsStore';
import { BudgetsStore } from '../domain/stores';
import { useHeaderContext } from '../hooks/useHeaderContext';
import { ImportCard } from '../components/ImportCard';
import { useLocalization } from '../hooks/useLocalization';

const ImportExport = (props: HeaderNotifierProps&RouterProps) => {

    const [exportData, setExportData] = React.useState<ExportDataSet>();
    const {history} = props;
    const loc = useLocalization();

    const budgetsStore = useBudgetsStore();

    useHeaderContext(loc.get('Import & Export'), <CloseButtonHistory history={history}/>, props);

    React.useEffect(() => {
        async function exportData (store: BudgetsStore) {
            try {
                setExportData(await store.export());
            } catch (error) {
                console.warn('There is no data to export: ', error);
                setExportData(undefined);
            }
        }
        if (budgetsStore) {
            exportData(budgetsStore);
        }
        
    }, [budgetsStore]);
    
    return (
        <React.Fragment>
            <ImportCard  />
            { exportData && <ExportCard fileName='exportedData' dataToExport={exportData}/> }
        </React.Fragment>
       
    );

}


export default ImportExport;
