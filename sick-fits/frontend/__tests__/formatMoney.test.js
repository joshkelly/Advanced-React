import formatMoney from '../lib/formatMoney';

describe('formatMoney Function', () => {
  it('Works with fracional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(99)).toEqual('$0.99');
    expect(formatMoney(140)).toEqual('$1.40');
    expect(formatMoney(199999)).toEqual('$1,999.99');
  });
  it('Leaves off cents for whole dollars', () => {
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(1000)).toEqual('$10');
    expect(formatMoney(9999900)).toEqual('$99,999');
  });
});
