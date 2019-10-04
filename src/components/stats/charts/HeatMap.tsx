import React from 'react';
import { ObjectMap } from '../../../api';
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
            dataPoints: props.dataPoints,
            start: props.start,
            end: new Date()
        }}
    />
);
