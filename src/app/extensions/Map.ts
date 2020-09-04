export { }

declare global {
	export interface Map<K, V> {
		where(predicate: (key: K, val: V) => boolean): Map<K, V>
		select<T>(predicate: (key: K, val: V) => T): Array<T>
		first(predicate?: (key: K, val: V) => boolean): { key: K, value: V } | undefined
	}
}

Map.prototype.where = function <K, V>(this: Map<K, V>, predicate: (key: K, val: V | [K, V]) => boolean): Map<K, V> {
	const resultMap = new Map<K, V>();
	for (const item of this) {
		if (predicate(item[0], item[1])) {
			resultMap.set(item[0], item[1]);
		}
	}
	return resultMap;
}

Map.prototype.select = function <K, V, T>(this: Map<K, V>, predicate: (key: K, val: V) => T): Array<T> {
	const result = new Array<T>();
	for (const item of this) {
		result.push(predicate(item[0], item[1]));
	}
	return result;
}

Map.prototype.first = function <K, V>(this: Map<K, V>, predicate?: (key: K, val: V | [K, V]) => boolean): { key: K, value: V } | undefined {
	for (const item of this) {
		if (predicate) {
			if (predicate(item[0], item[1])) {
				return { key: item[0], value: item[1] };
			}
		} else {
			return { key: item[0], value: item[1] };
		}
	}
	return null;
}