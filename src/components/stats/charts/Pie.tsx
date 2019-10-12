import * as React from "react";
import ReactFrappeChart from "react-frappe-charts";

interface PieChartProps {
    title: string;
    labels: string[];
    values: number[];
    maxSlices?: number;
    onSelect?: (identifier: string) => void;
}

export const PieChart: React.FC<PieChartProps> = (props) => {
    function handleSelect (event: {label: string}) {
        props.onSelect && props.onSelect(event.label);
    }

    return <ReactFrappeChart type='percentage' title={props.title} onDataSelect={handleSelect}
        maxSlices={props.maxSlices||8}
        data={{
            labels: props.labels,
            datasets: [{ values: props.values }], 
        }}
    />;
}
