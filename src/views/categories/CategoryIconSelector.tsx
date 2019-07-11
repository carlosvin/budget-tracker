import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { CategoryIconButton } from '../../components/CategoryIconButton';
import { btApp } from '../../BudgetTracker';

interface CategoryIconSelectorProps {
    selectedValue: string;
    open: boolean;
    onClose: (selectedValue: string) => void;
};

class CategoryIconSelector extends React.PureComponent<CategoryIconSelectorProps> {
    private readonly titleId = 'dialog-title';

    render (){
        return (
            <Dialog 
                onClose={this.handleClose} 
                aria-labelledby={this.titleId} open={this.props.open}>
                <DialogTitle id={this.titleId}>Select icon for category</DialogTitle>
                <DialogContent>
                    <Grid container direction='row' justify='center'>
                        { btApp.iconsStore.iconNames.map( name => 
                            <CategoryIconButton 
                                onClick={this.handleItemClick} 
                                name={name} 
                                key={`icon-${name}`} />)} 
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }

    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };

    handleItemClick = (value: string) => {
        this.props.onClose(value);
    };
}

export default CategoryIconSelector;
