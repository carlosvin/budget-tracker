import * as React from 'react';
import { Link } from 'react-router-dom';
import { VersusInfo } from '../VersusInfo';
import CardActions from '@material-ui/core/CardActions';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { useLoc } from '../../hooks/useLoc';

interface BudgetQuickStatsProps {
    totalBudget: number,
    totalSpent: number,
    totalDays: number,
    passedDays: number,
    expectedDailyAverage: number,
    dailyAverage?: number,
    urlStats?: string;
}

const spacing = '0.5rem';

export const BudgetQuickStats: React.FC<BudgetQuickStatsProps> = (props) => {
    const loc = useLoc();
    
    return <Card style={{ marginBottom: '1rem' }}>
        <CardContent>
            <VersusInfo
                total={props.totalBudget}
                spent={props.totalSpent}
                title={loc('Spent')} />
            <Box marginTop={spacing}>
                <VersusInfo
                    total={props.totalDays}
                    spent={props.passedDays}
                    title={loc('Days')} /></Box>
            {props.dailyAverage !== undefined &&
                <Box marginTop={spacing}>
                    <VersusInfo
                        total={props.expectedDailyAverage}
                        spent={props.dailyAverage}
                        title={loc('Daily Average')} /></Box>}
        </CardContent>
        {props.urlStats && <CardActions>
            <Button
                size='small'
                component={Link}
                color='primary'
                to={props.urlStats}>
                {loc('More Stats')}
            </Button>
        </CardActions>}
    </Card>;
}