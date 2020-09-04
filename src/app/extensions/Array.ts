export {};

declare global {
  export interface Array<T> {
    where(predicate: (val: T) => boolean): Array<T>;
    select<TResult>(predicate: (val: T) => TResult): Array<TResult>;
    first(predicate?: (val: T) => boolean): T | undefined;
  }
}

Array.prototype.where = function <T>(this: Array<T>, predicate: (val: T) => boolean): Array<T> {
  const resultArray = new Array<T>();
  for (const item of this) {
    if (predicate(item)) {
      resultArray.push(item);
    }
  }
  return resultArray;
};

Array.prototype.select = function <T, TResult>(this: Array<T>, predicate: (val: T) => TResult): Array<TResult> {
  const result = new Array<TResult>();
  for (const item of this) {
    result.push(predicate(item));
  }
  return result;
};

Array.prototype.first = function <T>(this: Array<T>, predicate?: (val: T) => boolean): T | undefined {
  for (const item of this) {
    if (predicate) {
      if (predicate(item)) {
        return item;
      }
    } else {
      return item;
    }
  }
};
