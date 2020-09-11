import './Map';

describe('Map', () => {
  let map: Map<number, string>;
  beforeEach(() => {
    map = new Map<number, string>();
    map.set(1, 'one');
    map.set(2, 'two');
    map.set(3, 'three');
    map.set(4, 'four');
    map.set(5, 'five');
    map.set(6, 'six');
    map.set(7, 'seven');
  });

  it('filter should only return values that match the predicate expression', () => {
    const result = map.filter((item) => item[0] < 4);
    expect(result.size).toBe(3);
    expect(result).toEqual(
      new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
      ])
    );
  });

  it('find should return the first array entry if called without a predicate', () => {
    const result = map.find();
    expect(result).toEqual({ key: 1, value: 'one' });
  });

  it('find should return the first matching array entry if called with a predicate', () => {
    const result = map.find((item) => item[0] > 2);
    expect(result).toEqual({ key: 3, value: 'three' });
  });

  it('find should return undefined if the Map is empty', () => {
    map.clear();
    const result = map.find((item) => item[0] > 2);
    expect(result).toEqual(undefined);
  });

  it('find should return undefined if no items match the predicate', () => {
    const result = map.find((item) => item[0] > 7);
    expect(result).toEqual(undefined);
  });

  it('map should return an array of the values returned by the passed predicate', () => {
    const result = map.map((item) => `${item[0]}. ${item[1]}`);
    expect(result).toHaveLength(7);
    expect(result).toEqual(['1. one', '2. two', '3. three', '4. four', '5. five', '6. six', '7. seven']);
  });
});
