import * as React from "react";
import { VictoryPie, VictoryTheme, VictoryLine, VictoryAxis } from "victory";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { DAY_MS } from "../../domain/BudgetModel";

interface GraphProps {
    title: string;
    data: {x: string|number, y: number}[];
}

export const GraphPie: React.FC<GraphProps> = (props) => (
    <GraphLayout title={props.title}>
        <VictoryPie 
            data={props.data} 
            colorScale='qualitative'
            theme={VictoryTheme.material}
        />
    </GraphLayout>
);


// TODO add separate axis for month and day and year? 
export const GraphLine: React.FC<GraphProps> = (props) => (
    <GraphLayout title={props.title}>
        <VictoryAxis
            scale="time"
            standalone={false}
            // style={styles.axisYears}
            dependentAxis
            tickValues={props.data
                .map(v => parseInt(v.x.toString()))
                .filter(v => (v % (DAY_MS * 15)) === 0 )}
            tickFormat={timeMs => new Date(timeMs).toLocaleString('en-us', { month:'numeric', day: 'numeric' })}
        />
        <VictoryLine
            data={props.data} 
            theme={VictoryTheme.material}
            interpolation='linear'
            label='Date'
        />
    </GraphLayout>
);

export const GraphLayout: React.FC<{title: string}> = (props) => (
    <Card>
        <CardHeader title={props.title} />
        <CardContent>
            { props.children }
        </CardContent>
    </Card>
);
