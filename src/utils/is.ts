export function isObject(value: unknown): value is object {
  return Reflect.toString.call(value) === '[object Object]'
}
