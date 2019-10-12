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

    it ('Add months in a loop, adding 1 in each step', () => {
        const y = 2019;
        const m = 0;
        const d = 1;
        const date = new DateDay(new Date(y, m, d));
        for (let i=0; i < 11; i++) {
            date.addMonths(1);
            expect(date.day).toBe(d);
            expect(date.month).toBe(i + 1);
            expect(date.year).toBe(y);
        };
        date.addMonths(1);
        expect(date.day).toBe(d);
        expect(date.month).toBe(0);
        expect(date.year).toBe(y+1);
    });

    it ('Add years in a loop, adding 1 in each step', () => {
        const y = 2019;
        const m = 0;
        const d = 1;
        const date = new DateDay(new Date(y, m, d));
        for (let i=0; i < 11; i++) {
            date.addYears(1);
            expect(date.day).toBe(d);
            expect(date.month).toBe(m);
            expect(date.year).toBe(y + i + 1);
        };
    });
});
