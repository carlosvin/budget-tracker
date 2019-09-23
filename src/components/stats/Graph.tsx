import * as React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import ReactFrappeChart from "react-frappe-charts";
import { DateDay } from "../../domain/DateDay";

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
            
            type="line"
            colors={["#21ba45"]}
            axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
            // height={250}
            data={{
                labels: props.data.map(point => new DateDay(point.x as Date).shortString),
                datasets: [{ values: props.data.map(point => point.y) }], 
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
