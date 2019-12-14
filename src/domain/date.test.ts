import { dateDiff } from "./date";
import { DateDay } from "./DateDay";

it('Check 2 dates diff', () => {
    const from = DateDay.fromYMD({day: 11, month: 0, year: 2019});
    const to = DateDay.fromYMD({day: 3, month: 2, year: 2020});
    expect(dateDiff(from.timeMs, to.timeMs)).toBe(418);
});

it('Dates diff between yesterday and tomorrow should be 3', () => {
    const yesterday = new DateDay().addDays(-1);
    const tomorrow = new DateDay().addDays(1);
    
    console.log('Yesterday:', yesterday.shortString);
    console.log('Today:', new DateDay().shortString);
    console.log('Tomorrow:', tomorrow.shortString);
    expect(dateDiff(new DateDay().addDays(-1).timeMs, new DateDay().addDays(1).timeMs)).toBe(3);
});

