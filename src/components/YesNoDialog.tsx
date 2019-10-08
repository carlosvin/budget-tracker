import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useLoc } from '../hooks/useLoc';

interface YesNoDialogProps {
    open: boolean,
    question: string,
    description?: string,
    onClose: (accept: boolean) => void
};

export const YesNoDialog: React.FC<YesNoDialogProps> = (props) => {
    const titleId = 'y-n-dialog-title';
    const descriptionId = 'y-n-dialog-description';

    const handleNo = () => (props.onClose(false));
    const handleYes = () => (props.onClose(true));
    const loc = useLoc();

    return (
        <Dialog
            open={props.open}
            onClose={handleNo}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
        >
            <DialogTitle id={titleId}>{props.question}</DialogTitle>
            {props.description && <DialogContent>
                <DialogContentText id={descriptionId}>{props.description}</DialogContentText>
            </DialogContent>}
            <DialogActions>
                <Button onClick={handleNo} color="primary">{loc('Disagree')}</Button>
                <Button onClick={handleYes} color="primary" autoFocus>{loc('Agree')}</Button>
            </DialogActions>
        </Dialog>
    );
}
