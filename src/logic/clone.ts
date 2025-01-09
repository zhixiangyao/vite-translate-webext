export function clone(target: object | []) {
  return JSON.parse(JSON.stringify(target))
}
