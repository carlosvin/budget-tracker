import { NestedTotal } from "./NestedTotal";

it('Operate with empty Nested Total: level 0', () => {
    const nestedTotal = new NestedTotal();
    expect(nestedTotal.total).toBe(0);
    expect(nestedTotal.add(1));
    expect(nestedTotal.total).toBe(1);
    expect(nestedTotal.subtract(1));
    expect(nestedTotal.total).toBe(0);
});

it('Operate with empty Nested Total: level 1', () => {
    const nestedTotal = new NestedTotal();
    expect(nestedTotal.add(1, [1,]));
    expect(nestedTotal.add(1, [1,]));
    expect(nestedTotal.add(1, [2,]));
    expect(nestedTotal.total).toBe(3);
    expect(nestedTotal.getSubtotal([1,])).toBe(2);
    expect(nestedTotal.getSubtotal([2,])).toBe(1);

    expect(nestedTotal.subtract(1, [1,]));
    expect(nestedTotal.getSubtotal([1,])).toBe(1);
    expect(nestedTotal.total).toBe(2);
});

it('Nested total with 3 levels: Year/Month/Day', () => {
    const nestedTotal = new NestedTotal();

    expect(nestedTotal.add(1, [2018, 5, 1]));
    expect(nestedTotal.add(1, [2019, 1, 1]));
    expect(nestedTotal.add(1, [2019, 1]));

    expect(nestedTotal.total).toBe(3);

    expect(nestedTotal.getSubtotal([2019,])).toBe(2);
    expect(nestedTotal.getSubtotal([2019, 1])).toBe(2);
    expect(nestedTotal.getSubtotal([2019, 1, 1])).toBe(1);

    expect(nestedTotal.getSubtotal([2018,])).toBe(1);
    expect(nestedTotal.getSubtotal([2018, 5])).toBe(1);
    expect(nestedTotal.getSubtotal([2018, 5, 1])).toBe(1);

    // non existent element
    expect(nestedTotal.getSubtotal([2020, 5, 1])).toBe(0);

});

it('Average calculation', () => {
    const nestedTotal = new NestedTotal();

    expect(nestedTotal.add(1, ['ES', '2019-5-1']));
    expect(nestedTotal.add(1, ['ES', '2019-5-2']));
    expect(nestedTotal.add(1, ['LU', '2019-5-2']));
    expect(nestedTotal.add(1, ['TH', '2019-5-3']));
    expect(nestedTotal.add(2, ['TH', '2019-5-4']));

    expect(nestedTotal.avg).toBe(2);
    expect(nestedTotal.getAverage(['ES'])).toBe(1);
    expect(nestedTotal.getAverage(['LU'])).toBe(1);
    expect(nestedTotal.getAverage(['TH'])).toBe(1.5);
});
