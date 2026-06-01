export function AsyncFunction(...args: string[]): Function {
  const body = args.pop()
  const params = args

  return Object.getPrototypeOf(async function () {}).constructor(...params, body)
}
