import * as React from "react";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export class About extends React.PureComponent {

    render() {
        return (<div>
            <Paper elevation={1}>
                <Typography variant="h5" component="h3">
            Budget tracker
                </Typography>
                <Typography component="p">
            Version 1.2.3
                </Typography>
            </Paper>
        </div>);
    }
}