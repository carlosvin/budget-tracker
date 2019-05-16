import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { Icons, iconsStore } from '../../stores/IconsStore';
import { CategoryIconButton } from './CategoryIconButton';

interface IconsDialogSelectorProps {
    selectedValue: string;
    open: boolean;
    onClose: (selectedValue: string) => void;
};

export class IconsDialogSelector extends React.PureComponent<IconsDialogSelectorProps> {
    private readonly titleId = 'dialog-title';

    render (){
        return (
            <Dialog 
                onClose={this.handleClose} 
                aria-labelledby={this.titleId} open={this.props.open}>
                <DialogTitle id={this.titleId}>Select icon for category</DialogTitle>
                <DialogContent>
                    <Grid container direction='row' justify='center'>
                    { iconsStore.getIconNames().map( name => 
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

