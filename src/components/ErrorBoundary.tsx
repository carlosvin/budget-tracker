import * as React from 'react';
import { SnackbarError } from './SnackbarError';

export class ErrorBoundary extends React.Component<{}, { error: string | null }> {

    constructor(props: {}) {
        super(props);
        this.state = { error: null };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error(error, info);
        this.setState({ error: error.message });
    }

    render() {
        if (this.state.error) {
            return <SnackbarError error={this.state.error}/>      
        }
        return this.props.children;
    }
}