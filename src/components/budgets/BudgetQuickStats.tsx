import * as React from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Link from '@material-ui/core/Link';
import { VersusInfo } from '../VersusInfo';
import { Link as RouterLink } from 'react-router-dom';

interface BudgetQuickStatsProps {
    totalBudget: number,
    totalSpent: number,
    totalDays: number,
    passedDays: number,
    expectedDailyAverage: number,
    dailyAverage?: number,
    urlStats?: string;
}

export const BudgetQuickStats: React.FC<BudgetQuickStatsProps> = (props) => (
    <GridList cellHeight={50} cols={2} >
        <GridListTile key='total' cols={2}>
            <VersusInfo 
                total={props.totalBudget}
                spent={props.totalSpent}
                title='Spent'/>
        </GridListTile>
        <GridListTile key='days' cols={2}>
            <VersusInfo 
                total={props.totalDays}
                spent={props.passedDays} 
                title='Days'/>
        </GridListTile>
        { props.dailyAverage !== undefined && <GridListTile key='average' cols={2}>
            <VersusInfo 
                total={props.expectedDailyAverage} 
                spent={props.dailyAverage}
                title='Daily Average'/>
        </GridListTile> }
        { props.urlStats && <Link variant='caption' component={RouterLink} to={props.urlStats}>
            More Stats</Link> }
    </GridList>);
