import * as React from 'react';
import { HeaderNotifierProps } from '../routes';
import { RouterProps } from 'react-router';
import { ImportForm } from '../components/ImportForm';
import { ExportDataSet } from '../interfaces';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import { ExportCard } from '../components/ExportCard';
import { CloseButton } from '../components/buttons/CloseButton';
import { ExportDataInfo } from '../components/ExportDataInfo';
import { useBudgetsStore } from '../hooks/useBudgetsStore';
import { BudgetsStore } from '../domain/stores/interfaces';

const ImportExport = (props: HeaderNotifierProps&RouterProps) => {

    const [importData, setImportData] = React.useState<Partial<ExportDataSet>>();
    const [exportData, setExportData] = React.useState<ExportDataSet>();
    const {history, onActions, onTitleChange} = props;

    const budgetsStore = useBudgetsStore();

    React.useLayoutEffect(() => {
        onTitleChange('Import & Export');
        onActions(<CloseButton history={history}/>);
        return function () {
            onTitleChange('');
            onActions(undefined);
        }
    // eslint-disable-next-line
    }, []);

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
    
    // TODO create ImportCard as we did with ExportCard
    return (
        <React.Fragment>
        <Card style={{marginBottom: '1rem'}}>
            <CardHeader title='Import JSON'></CardHeader>
            { importData &&  <CardContent>
                <ExportDataInfo {...importData}/>
            </CardContent> }
            <CardActions>
                <ImportForm onImportedData={setImportData}/>
            </CardActions>
        </Card>
            { exportData && <ExportCard fileName='exportedData' dataToExport={exportData}/> }
        </React.Fragment>
       
    );

}


export default ImportExport;
