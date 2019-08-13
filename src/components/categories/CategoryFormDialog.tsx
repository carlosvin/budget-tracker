import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { CategoryForm } from './CategoryForm';
import { Category } from '../../interfaces';

interface CategoryFormDialogProps {
    open: boolean;
    onClose: (category?: Category) => void;
}

export const CategoryFormDialog: React.FC<CategoryFormDialogProps> = (props) => {
    const titleId = 'category-dialog-title';

    const handleClose = () => ( props.onClose() );

    return (
        <Dialog 
            aria-labelledby={titleId} 
            open={props.open}
            onClose={handleClose}>
            <DialogTitle id={titleId}>
                Add category
            </DialogTitle>
            <DialogContent>
                <CategoryForm onSubmit={props.onClose} />
            </DialogContent>
        </Dialog>
    );

}
