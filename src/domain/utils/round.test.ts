import { round } from "./round";

it('Round decimal number', () => {
    expect(round(53.434334)).toBe(53.43);
    expect(round(100.5555555, 4)).toBe(100.5556);
    expect(round(99.9999, 0)).toBe(100);
});
