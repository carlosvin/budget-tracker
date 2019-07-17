import * as React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

interface VersusInfoProps {
    total: number;
    spent: number;
    title: string;
}

function percentage (spent: number, total: number) {
    if (total) {
        return (spent / total) * 100;
    }
    return 0;
}

declare type FType = number|string;

const FieldDataView: React.FC<{text:FType, secondary?: FType}> = (props) => (
        <Typography variant='body2' noWrap>
            {props.text} 
            { props.secondary && 
                <Typography variant='caption' color='textSecondary'>
                    {props.secondary}</Typography> }
        </Typography>

);

export const VersusInfo: React.FC<VersusInfoProps> = (props) => {
    const {spent, total, title} = props;

    const exceeded = spent > total;

    return (<React.Fragment>
        <Grid container justify='space-between' direction='row'>
            <FieldDataView text={Math.round(spent)}/>
            <FieldDataView text={title} secondary={` (${total})`}/>
            <FieldDataView text={Math.round(total - spent)}/>
        </Grid>
        <LinearProgress 
            color={exceeded ? 'secondary' : 'primary'}
            variant='determinate' 
            value={ exceeded ? 100 : percentage(spent, total) }/>
    </React.Fragment>);
}
