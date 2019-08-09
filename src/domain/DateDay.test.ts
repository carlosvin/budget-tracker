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
});
