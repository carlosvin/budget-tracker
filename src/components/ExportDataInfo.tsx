import * as React from 'react';
import Box from '@material-ui/core/Box';
import { ExportDataSet } from '../interfaces';
import { SubHeader } from './expenses/SubHeader';

export const ExportDataInfo: React.FC<Partial<ExportDataSet>> = (props) => (
    <Box>
        <ImportedElementInfo name='Budgets' elements={props.budgets}/>
        <ImportedElementInfo name='Expenses' elements={props.expenses}/>
        <ImportedElementInfo name='Categories' elements={props.categories}/>
    </Box>
);

function ImportedElementInfo <T>(props: {elements?:{[k: string]: T}, name: string}){
    const {elements, name} = props;
    if (elements) {
        return (
            <SubHeader leftText={Object.keys(elements).length} rightText={name} variant='body1' />
        );
    }
    return null;
}