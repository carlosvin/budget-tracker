import React from 'react';
import ReactFrappeChart from 'react-frappe-charts';

interface BarChartProps {
    title: string;
    labels: string[];
    values: number[];
}

export const BarChart: React.FC<BarChartProps> = (props) => (
    <ReactFrappeChart
        title={props.title}
        type='bar'
        data={{
            labels: props.labels,
            datasets: [{ values: props.values }], 
        }}
    />
);
