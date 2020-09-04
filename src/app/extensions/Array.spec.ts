import './Array';

describe('Array', () => {
  it('where should only return values that match the predicate expression', () => {
    const array = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const result = array.where((w) => w < 50);
    expect(result).toHaveLength(5);
    expect(result).toEqual([0, 10, 20, 30, 40]);
  });

  it('first should return the first array entry if called without a predicate', () => {
    const array = ['doe', 'ray', 'mi', 'fah', 'so', 'latte'];
    const result = array.first();
    expect(result).toEqual('doe');
  });

  it('first should return the first matching array entry if called with a predicate', () => {
    const array = ['doe', 'ray', 'mi', 'fah', 'so', 'latte'];
    const result = array.first((w) => w.length === 2);
    expect(result).toEqual('mi');
  });

  it('first should return undefined if there are no values', () => {
    const array = [];
    const result = array.first();
    expect(result).toEqual(undefined);
  });

  it('first should return undefined if no items match the predicate', () => {
    const array = ['doe', 'ray', 'mi', 'fah', 'so', 'latte'];
    const result = array.first((w) => w.length === 15);
    expect(result).toEqual(undefined);
  });

  it('select should return an array of the values returned by the passed predicate', () => {
    const array = ['doe', 'ray', 'mi', 'fah', 'so', 'latte'];
    const result = array.select((s) => s.length);
    expect(result).toHaveLength(6);
    expect(result).toEqual([3, 3, 2, 3, 2, 5]);
  });
});
