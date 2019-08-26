import { stringToColor } from "./stringToColor";

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
