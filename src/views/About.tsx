import * as React from "react";
import Typography from '@material-ui/core/Typography';

export class About extends React.PureComponent {

    render() {
        return (
            <React.Fragment>
                <Typography variant="h5" component="h3">
                    Budget tracker
                </Typography>
                <Typography component="p">
                    Version 1.2.3
                </Typography>
            </React.Fragment>);
    }
}