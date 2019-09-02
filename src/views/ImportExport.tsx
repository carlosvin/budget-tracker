import * as React from 'react';
import { HeaderNotifierProps } from '../routes';
import { RouterProps } from 'react-router';
import { ImportForm } from '../components/ImportForm';
import { ExportDataSet } from '../interfaces';
import { Card, CardContent, CardHeader, CardActions } from '@material-ui/core';
import { SubHeader } from '../components/expenses/SubHeader';
import { ExportCard } from '../components/ExportCard';
import { btApp } from '../BudgetTracker';

const ImportExport = (props: HeaderNotifierProps&RouterProps) => {

    const [data, setData] = React.useState<Partial<ExportDataSet>>();

    React.useLayoutEffect(() => {
        props.onTitleChange('Import & Export');
        props.onActions([]);
        return function () {
            props.onTitleChange('');
        }
    // eslint-disable-next-line
    }, []);
    
    return (
        <React.Fragment>
        <Card style={{marginBottom: '1rem'}}>
            <CardHeader title='Import JSON'></CardHeader>
            { data &&  <CardContent>
                <ImportedElementInfo name='Budgets' elements={data.budgets}/>
                <ImportedElementInfo name='Expenses' elements={data.expenses}/>
                <ImportedElementInfo name='Categories' elements={data.categories}/>
            </CardContent> }
            <CardActions>
                <ImportForm onImportedData={setData}/>
            </CardActions>
        </Card>
        <ExportCard fileName='exportedData' fetchDataPromise={btApp.export()}/>
        </React.Fragment>
       
    );

}

const ImportedElementInfo: React.FC<{elements?:{[k: string]: any}, name: string}> = (props) => {
    const {elements, name} = props;
    if (elements) {
        return (
            <SubHeader leftText={Object.keys(elements).length} rightText={`${name} imported`} variant='body1' />
        );
    }
    return null;
}

export default ImportExport;
