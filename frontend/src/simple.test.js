test('1 + 1 equals 2', () => {
    expect(1 + 1).toBe(2);
});

test('true is truthy', () => {
    expect(true).toBeTruthy();
});

test('object assignment', () => {
    const data = { one: 1 };
    data['two'] = 2;
    expect(data).toEqual({ one: 1, two: 2 });
});
