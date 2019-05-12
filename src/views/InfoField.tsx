import * as React from 'react';
import Card  from '@material-ui/core/Card';
import CardContent  from '@material-ui/core/CardContent';
import Typography  from '@material-ui/core/Typography';

interface InfoFieldProps {
    label: string;
    value: string|number;
}

export class InfoField extends React.PureComponent<InfoFieldProps> {

    render () {
        return (
            <Card>
                <CardContent>
                    <Typography color='textSecondary' gutterBottom>
                        {this.props.label}
                    </Typography>
                    <Typography variant="h6" component="h3">
                        {this.props.value}
                    </Typography>
                </CardContent>
            </Card>);
    }
}
