import * as React from 'react';
import Box from '@material-ui/core/Box';
import { ExportDataSet, ObjectMap } from '../api';
import { SubHeader } from './expenses/SubHeader';
import { useLocalization } from '../hooks/useLocalization';

export const ExportDataInfo: React.FC<Partial<ExportDataSet>> = (props) => {
    const loc = useLocalization();

    return <Box>
        <ImportedElementInfo name={loc.get('Budgets')} elements={props.budgets} />
        <ImportedElementInfo name={loc.get('Expenses')} elements={props.expenses} />
        <ImportedElementInfo name={loc.get('Categories')} elements={props.categories} />
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