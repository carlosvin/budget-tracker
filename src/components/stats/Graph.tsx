import * as React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import ReactFrappeChart from "react-frappe-charts";
import { DateDay } from "../../domain/DateDay";
import { round } from "../../domain/utils/round";

interface GraphProps {
    title: string;
    data: { x: string | number | Date, y: number }[];
}

export const GraphPie: React.FC<GraphProps> = (props) => (
    <GraphLayout title={props.title}>
        <ReactFrappeChart type='percentage'
            data={{
                labels: props.data.map(point => point.x.toString()),
                datasets: [{ values: props.data.map(point => point.y) }], 
            }}
        />
    </GraphLayout>
);

export const GraphTimeLine: React.FC<GraphProps & { avg: number, expectedAvg: number }> = (props) => (
    <GraphLayout title={props.title}>
        
        <ReactFrappeChart
            lineOptions={{hideDots: 1, areaFill: 1, heatline: 1, dotSize: 0, hideLine: 0, regionFill: 1 }}
            type="line"
            //colors={["#21ba45"]}
            axisOptions={{ xAxisMode: 'tick', yAxisMode: 'tick', xIsSeries: 1}}
            data={{
                labels: props.data.map(point => new DateDay(point.x as Date).shortString),
                datasets: [{ 
                    values: props.data.map(point => round(point.y)),
                }], 
            }}
        />
    </GraphLayout>
);

export const GraphLayout: React.FC<{ title: string }> = (props) => (
    <Card>
        <CardHeader title={props.title} />
        <CardContent>
            {props.children}
        </CardContent>
    </Card>
);
