import { dateDiff, round, stringToColor } from "./utils";

it('Check 2 dates diff (5d)', () => {
    expect(dateDiff(new Date(2019, 5, 5).getTime(), new Date(2019, 5, 10).getTime())).toBe(5);
});

it('Round decimal number', () => {
    expect(round(53.434334)).toBe(53.43);
    expect(round(100.5555555, 4)).toBe(100.5556);
});

it('String to RGB color', () => {
    const assertValidColor = (c: number) => {
        expect(c).toBeLessThan(256);
        expect(c).toBeGreaterThanOrEqual(0);
    }
    const assertValidRGB = (color: {r: number, g: number, b: number}) => {
        assertValidColor(color.r);
        assertValidColor(color.g);
        assertValidColor(color.b);
    }
    assertValidRGB(stringToColor('Label'));
    assertValidRGB(stringToColor('Label with white spaces'));
    assertValidRGB(stringToColor('Lorem ipsum....'));
    assertValidRGB(stringToColor('Short'));
});


