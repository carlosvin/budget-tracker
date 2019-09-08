import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { CategoryIconButton } from '../../components/categories/CategoryIconButton';
import { useIconNames } from '../../hooks/useIconNames';

interface CategoryIconDialogSelectorProps {
    selectedValue: string;
    open: boolean;
    onClose: (selectedValue: string) => void;
};

const titleId = 'dialog-title';

function CategoryIconDialogSelector (props: CategoryIconDialogSelectorProps) {

    function handleClose() {
        props.onClose(props.selectedValue);
    }

    function handleItemClick(value: string) {
        props.onClose(value);
    }

    const iconNames = useIconNames();

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby={titleId} open={props.open}>
            <DialogTitle id={titleId}>Select icon for category</DialogTitle>
            <DialogContent>
                <Grid container direction='row' justify='center'>
                    {iconNames && iconNames.map(name =>
                        <CategoryIconButton
                            onClick={handleItemClick}
                            name={name}
                            key={`icon-${name}`} />)}
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default CategoryIconDialogSelector;
