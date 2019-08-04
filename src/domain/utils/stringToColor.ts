import { hash } from "./hash";

export function stringToColor (text: string) {
    let hashed = Math.abs(hash(text));
    const r = hashed % 200;
    hashed = hashed >> 7;
    const g = hashed % 200;
    hashed = hashed >> 7;
    const b = hashed % 200;
    return {r, g, b};
}

export function stringToColorCss (text: string) {
    const rgb = stringToColor(text);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
