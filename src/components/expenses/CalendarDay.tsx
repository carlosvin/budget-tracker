import * as React from "react";
import { YMD } from "../../api";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { DateDay } from "../../domain/DateDay";

interface CalendarDayProps {
    total: number; 
    expected: number; 
    budgetId: string;
    onDaySelected: (day: YMD) => void;
    date: YMD;
};

export const CalendarDay: React.FC<CalendarDayProps> = (props) => {

    const isToday = DateDay.isToday(props.date);

    function handleDaySelected () {
        props.onDaySelected(props.date);
    }

    const buttonRef = React.useRef<HTMLButtonElement|null>(null);

    React.useEffect(() => {
        if (buttonRef && buttonRef.current && isToday) {
            buttonRef.current.focus();
        }
    });


    return (
        <Button 
            variant={isToday ? 'outlined' : 'text'} 
            onClick={handleDaySelected}
            ref={isToday ? buttonRef : null} 
            >
            <Box p={1}>
                <Typography color='textPrimary'>{props.date.day}</Typography>
                <Typography variant='caption' color={props.total > props.expected ? 'error' : 'textSecondary'}>{props.total.toFixed()}</Typography>
            </Box>
        </Button>);
}