export {};

declare global {
  export interface Map<K, V> {
    filter(predicate: (item: [K, V]) => boolean): Map<K, V>;
    map<T>(predicate: (item: [K, V]) => T): Array<T>;
    find(predicate?: (item: [K, V]) => boolean): { key: K; value: V } | undefined;
  }
}

Map.prototype.filter = function <K, V>(this: Map<K, V>, predicate: (item: [K, V]) => boolean): Map<K, V> {
  const resultMap = new Map<K, V>();
  for (const item of this) {
    if (predicate(item)) {
      resultMap.set(item[0], item[1]);
    }
  }
  return resultMap;
};

Map.prototype.map = function <K, V, T>(this: Map<K, V>, predicate: (item: [K, V]) => T): Array<T> {
  const result = new Array<T>();
  for (const item of this) {
    result.push(predicate(item));
  }
  return result;
};

Map.prototype.find = function <K, V>(this: Map<K, V>, predicate?: (item: [K, V]) => boolean): { key: K; value: V } | undefined {
  for (const item of this) {
    if (predicate) {
      if (predicate(item)) {
        return { key: item[0], value: item[1] };
      }
    } else {
      return { key: item[0], value: item[1] };
    }
  }
};
