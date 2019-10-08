import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { CategoryForm } from './CategoryForm';
import { Category } from '../../api';
import { useLoc } from '../../hooks/useLoc';

interface CategoryFormDialogProps {
    open: boolean;
    onClose: (category?: Category) => void;
}

export const CategoryFormDialog: React.FC<CategoryFormDialogProps> = (props) => {
    const titleId = 'category-dialog-title';
    const loc = useLoc();

    const handleClose = () => ( props.onClose() );

    return (
        <Dialog 
            aria-labelledby={titleId} 
            open={props.open}
            onClose={handleClose}>
            <DialogTitle id={titleId}>
                {loc('Add category')}
            </DialogTitle>
            <DialogContent style={{marginBottom: '1rem'}}>
                <CategoryForm onSubmit={props.onClose} />
            </DialogContent>
        </Dialog>
    );
}
