import * as React from 'react';
import { ImportForm } from './ImportForm';
import { ExportDataSet } from '../api';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import { ExportDataInfo } from './ExportDataInfo';
import { useLoc } from '../hooks/useLoc';

export const ImportCard: React.FC = () => {

    const [importData, setImportData] = React.useState<Partial<ExportDataSet>>();
    const loc = useLoc();
    
    return (
        <Card style={{marginBottom: '1rem'}}>
            <CardHeader title={loc('Import JSON')}></CardHeader>
            { importData &&  <CardContent>
                <ExportDataInfo {...importData}/>
            </CardContent> }
            <CardActions>
                <ImportForm onImportedData={setImportData}/>
            </CardActions>
        </Card>
    );
}
