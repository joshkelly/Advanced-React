function add(a, b) {
  return a + b;
}

describe('Sample Test 101', () => {
  it('Works as expected', () => {
    // Run expect statements to see if the test will pass
    expect(1).toEqual(1);
    const age = 100;
    expect(age).toEqual(100);
  });
  it('Function Add Works', () => {
    expect(add(1, 2)).toBeGreaterThanOrEqual(3);
  });
});
