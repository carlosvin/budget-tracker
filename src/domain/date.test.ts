import { dateDiff } from "./date";
import { DateDay } from "./DateDay";

it('Check 2 dates diff (from 0 to 366 days)', () => {
    for (let i=0; i < 367; i++) {
        expect(dateDiff(new DateDay().timeMs, new DateDay().addDays(i).timeMs)).toBe(i+1);
    }
});

it('Dates diff between yesterday and tomorrow should be 3', () => {
    const yesterday = new DateDay().addDays(-1);
    const tomorrow = new DateDay().addDays(1);
    
    console.log('Yesterday:', yesterday);
    console.log('Today:', new DateDay());
    console.log('Tomorrow:', tomorrow);
    expect(dateDiff(new DateDay().addDays(-1).timeMs, new DateDay().addDays(1).timeMs)).toBe(3);
});

