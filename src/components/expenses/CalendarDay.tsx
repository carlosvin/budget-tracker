import * as React from "react";
import { YMD } from "../../interfaces";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { round } from "../../utils";
import { DateDay } from "../../domain/DateDay";

interface CalendarDayProps {
    total: number; 
    expected: number; 
    budgetId: string;
    onDaySelected: (day: YMD) => void;
    date: YMD;
};

export const CalendarDay: React.FC<CalendarDayProps> = (props) => {
    
    function handleDaySelected () {
        props.onDaySelected(props.date);
    }

    return (
    <Button 
        variant={DateDay.isToday(props.date) ? 'outlined' : 'text'} 
        onClick={handleDaySelected} >
        <Box p={1}>
            <Typography color='textPrimary'>{props.date.day}</Typography>
            <Typography variant='caption' color={props.total > props.expected ? 'error' : 'textSecondary'}>{round(props.total, 0)}</Typography>
        </Box>
    </Button>);
}