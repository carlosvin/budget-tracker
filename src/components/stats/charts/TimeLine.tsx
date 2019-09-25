import React from 'react';
import ReactFrappeChart from "react-frappe-charts";
import { DateDay } from "../../../domain/DateDay";

interface TimeLineChartProps {
    title: string;
    avg: number;
    expectedAvg: number;
    labels: DateDay[];
    values: number[];
}

export const TimeLineChart: React.FC<TimeLineChartProps> = (props) => (
    <ReactFrappeChart
        title={props.title}
        lineOptions={{
            hideDots: 1, 
            areaFill: 1, 
            heatline: 1, 
            dotSize: 0, 
            hideLine: 0, 
            regionFill: 1 }}
        type='line'
        axisOptions={{ xAxisMode: 'tick', yAxisMode: 'tick', xIsSeries: 1}}
        data={{
            labels: props.labels.map(d => d.shortString),
            datasets: [{ 
                values: props.values,
            }], 
        }}
    />
);