import { DateDay } from "./DateDay";

describe('DateDay', () => {

    it ('Add Days', () => {
        const date = new DateDay(new Date(2019, 0, 30));
        date.addDays(1);
        expect(date.day).toBe(31);
        expect(date.month).toBe(0);
        date.addDays(1);
        expect(date.day).toBe(1);
        expect(date.month).toBe(1);
    });

    it ('Add 365 days in a loop, adding 1 in each step', () => {
        const y = 2019;
        const m = 0;
        const d = 1;
        const date = new DateDay(new Date(y, m, d));
        for (let i=0; i < 365; i++) {
            date.addDays(1);
        };
        expect(date.year).toBe(y+1);
        expect(date.month).toBe(m);
    });
});
