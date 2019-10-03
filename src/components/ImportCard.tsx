import * as React from 'react';
import { ImportForm } from './ImportForm';
import { ExportDataSet } from '../interfaces';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import { ExportDataInfo } from './ExportDataInfo';

export const ImportCard: React.FC = () => {

    const [importData, setImportData] = React.useState<Partial<ExportDataSet>>();
    
    return (
        <Card style={{marginBottom: '1rem'}}>
            <CardHeader title='Import JSON'></CardHeader>
            { importData &&  <CardContent>
                <ExportDataInfo {...importData}/>
            </CardContent> }
            <CardActions>
                <ImportForm onImportedData={setImportData}/>
            </CardActions>
        </Card>
    );
}
