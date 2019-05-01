import { dateDiff } from "../src/utils";

test('Check 2 dates diff (5d)', () => {
    expect(dateDiff(new Date(2019, 5, 5), new Date(2019, 5, 10))).toBe(5);
});
