test('Jest is working', () => {
    expect(true).toBe(true);
});

test('Basic math works', () => {
    expect(2 + 2).toBe(4);
});

test('Strings work', () => {
    expect('hello').toBe('hello');
});

test('Arrays work', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
});
