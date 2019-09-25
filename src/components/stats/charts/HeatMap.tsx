import React from 'react';
import { ObjectMap } from '../../../interfaces';
import ReactFrappeChart from 'react-frappe-charts';

interface HeatMapChartProps {
    title: string;
    dataPoints: ObjectMap<number>;
    start: Date;
}

export const HeatMapChart: React.FC<HeatMapChartProps> = (props) => (
    <ReactFrappeChart
        title={props.title}
        type='heatmap'
        data={{
            // TODO when react-frappe-charts library supports data points, use them
            labels: [],
            datasets: [],
            // dataPoints: props.dataPoints,
            start: props.start,
            end: new Date()
        }}
    />
);
