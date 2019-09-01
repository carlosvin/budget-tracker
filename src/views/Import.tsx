import * as React from 'react';
import { HeaderNotifierProps } from '../routes';
import { RouterProps } from 'react-router';
import { ImportForm } from '../components/ImportForm';
import { ExportDataSet } from '../interfaces';
import { Card, CardActionArea, CardContent, CardHeader } from '@material-ui/core';
import { SubHeader } from '../components/expenses/SubHeader';

const Import = (props: HeaderNotifierProps&RouterProps) => {

    const [data, setData] = React.useState<Partial<ExportDataSet>>();

    React.useLayoutEffect(() => {
        props.onTitleChange('Import budgets');
        props.onActions([]);
        return function () {
            props.onTitleChange('');
        }
    // eslint-disable-next-line
    }, []);

    // React.useEffect(()=>{}, [data]);
    
    return (
        <Card>
            <CardHeader title='Import budgets'></CardHeader>
            { data &&  <CardContent>
                <ImportedElementInfo name='Budgets' elements={data.budgets}/>
                <ImportedElementInfo name='Expenses' elements={data.expenses}/>
                <ImportedElementInfo name='Categories' elements={data.categories}/>
            </CardContent> }
            <CardActionArea>
                <ImportForm onImportedData={setData}/>);
            </CardActionArea>
        </Card>);

}

const ImportedElementInfo: React.FC<{elements?:{[k: string]: any}, name: string}> = (props) => {
    const {elements, name} = props;
    if (elements) {
        return (
            <SubHeader leftText={elements.length} rightText={`${name} imported`} variant='body1' />
        );
    }
    return null;
}

export default Import;
