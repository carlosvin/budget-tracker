import { dateDiff } from "./date";
import { DateDay } from "./DateDay";

it('Check 2 dates diff (from 0 to 366 days)', () => {
    for (let i=0; i < 367; i++) {
        expect(dateDiff(new DateDay().timeMs, new DateDay().addDays(i).timeMs)).toBe(i);
    }
});
