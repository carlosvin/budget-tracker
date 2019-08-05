import { dateDiff } from "./utils";

it('Check 2 dates diff (5d)', () => {
    expect(dateDiff(new Date(2019, 5, 5).getTime(), new Date(2019, 5, 10).getTime())).toBe(5);
});

