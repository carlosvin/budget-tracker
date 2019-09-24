import * as React from "react";
import ReactFrappeChart from "react-frappe-charts";

interface PieChartProps {
    title: string;
    labels: string[];
    values: number[];
    maxSlices?: number;
}

export const PieChart: React.FC<PieChartProps> = (props) => (
    <ReactFrappeChart type='percentage' title={props.title} isNavigable={true} 
        maxSlices={props.maxSlices||8}
        data={{
            labels: props.labels,
            datasets: [{ values: props.values }], 
        }}
    />
);
