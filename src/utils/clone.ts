export function clone<T extends object | []>(target: T): T {
  return JSON.parse(JSON.stringify(target))
}
