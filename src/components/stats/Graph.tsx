import * as React from "react";
import { VictoryPie, VictoryTheme, VictoryLine, VictoryChart } from "victory";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

interface GraphProps {
    title: string;
    data: {x: string|number|Date, y: number}[];
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

export const GraphTimeLine: React.FC<GraphProps&{avg: number, expectedAvg: number}> = (props) => (
    <GraphLayout title={props.title}>
        <VictoryChart scale={{x: 'time'}} >
            <VictoryLine
                data={props.data} 
                theme={VictoryTheme.material}
                interpolation='step'
                scale={{x: 'time', y: 'log'}}
            />
            <VictoryLine
                data={props.data.map(v => ({x: v.x, y: props.avg}))} 
                style={{data: {stroke: '#4a148c', strokeWidth: 1}}}
                scale={{x: 'time'}}
            />
            <VictoryLine
                data={props.data.map(v => ({x: v.x, y: props.expectedAvg}))} 
                style={{data: {stroke: 'red', strokeWidth: 1}}}
                scale={{x: 'time'}}
            />
        </VictoryChart>
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
