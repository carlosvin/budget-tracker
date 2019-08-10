import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { CategoryIconButton } from '../../components/categories/CategoryIconButton';

interface CategoryIconSelectorProps {
    selectedValue: string;
    open: boolean;
    onClose: (selectedValue: string) => void;
    iconNames: string[];
};

const titleId = 'dialog-title';

export const CategoryIconSelector: React.FC<CategoryIconSelectorProps> = (props) => {

    function handleClose() {
        props.onClose(props.selectedValue);
    }

    function handleItemClick(value: string) {
        props.onClose(value);
    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby={titleId} open={props.open}>
            <DialogTitle id={titleId}>Select icon for category</DialogTitle>
            <DialogContent>
                <Grid container direction='row' justify='center'>
                    {props.iconNames.map(name =>
                        <CategoryIconButton
                            onClick={handleItemClick}
                            name={name}
                            key={`icon-${name}`} />)}
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default CategoryIconSelector;
