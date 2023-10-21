/**
 * Checks that the given obj is an object and has the given key.
 *
 * @param obj Object to check.
 * @param key Key to check for.
 * @returns True if given input is an object and contains the given key.
 */
export function hasKey<T extends (string | number | symbol)>(
  obj: unknown, key: T
): obj is { [key in T]: unknown } {
  return (!!obj) && typeof obj === 'object' && key in obj;
}
