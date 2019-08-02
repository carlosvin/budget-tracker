import * as React from "react";
import { VictoryPie, VictoryTheme } from "victory";
import Card from "@material-ui/core/Card";
import { CardHeader, CardContent } from "@material-ui/core";

interface GraphProps {
    title: string;
    data: {x: string, y: number}[];
}

export const Graph: React.FC<GraphProps> = (props) => (
    <Card>
        <CardHeader title={props.title} />
        <CardContent>
            <VictoryPie 
                data={props.data} 
                colorScale='qualitative'
                startAngle={90}
                endAngle={-90}
                theme={VictoryTheme.material}
                />
        </CardContent>
    </Card>
);
