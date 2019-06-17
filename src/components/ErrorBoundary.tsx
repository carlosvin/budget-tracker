import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export class ErrorBoundary extends React.Component<{}, { error: string | null }> {

    constructor(props: {}) {
        super(props);
        this.state = { error: null };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        this.setState({ error: error.message });
        this.log(error, info);
    }

    private log(error: Error, info: React.ErrorInfo) {
        console.error(error, info);
    }

    private handleClose = () => {
        this.setState({ error: null });
    }

    render() {
        if (this.state.error) {
            return (
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                    open={this.state.error !== undefined}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    ContentProps={{ 'aria-describedby': 'message-id', }}
                    message={<span id="message-id">{this.state.error}</span>}
                    action={[
                        <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
                            Close
                        </Button>,
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />);
        }
        return this.props.children;
    }
}