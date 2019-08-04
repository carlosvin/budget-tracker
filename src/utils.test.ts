import { dateDiff, round } from "./utils";

it('Check 2 dates diff (5d)', () => {
    expect(dateDiff(new Date(2019, 5, 5).getTime(), new Date(2019, 5, 10).getTime())).toBe(5);
});

it('Round decimal number', () => {
    expect(round(53.434334)).toBe(53.43);
    expect(round(100.5555555, 4)).toBe(100.5556);
});



