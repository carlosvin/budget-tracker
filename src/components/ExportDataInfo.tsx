import * as React from 'react';
import Box from '@material-ui/core/Box';
import { ExportDataSet, ObjectMap } from '../api';
import { SubHeader } from './expenses/SubHeader';
import { useLoc } from '../hooks/useLoc';

export const ExportDataInfo: React.FC<Partial<ExportDataSet>> = (props) => {
    const loc = useLoc();

    return <Box>
        <ImportedElementInfo name={loc('Budgets')} elements={props.budgets} />
        <ImportedElementInfo name={loc('Expenses')} elements={props.expenses} />
        <ImportedElementInfo name={loc('Categories')} elements={props.categories} />
    </Box>;
}


const ImportedElementInfo: React.FC<{ elements?: ObjectMap<any>, name: string }> = (props) => {
    const { elements, name } = props;
    if (elements) {
        return (
            <SubHeader leftText={Object.keys(elements).length} rightText={name} variant='body1' />
        );
    }
    return null;
}