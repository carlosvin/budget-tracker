
import * as React from 'react';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { AppButtonProps, AppButton } from './buttons';

export const ImportExportButton: React.FC<AppButtonProps> = (props) => (
    <AppButton icon={ImportExportIcon} aria-label='Import' {...props}/>
);
