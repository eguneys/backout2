export function callMaybe(fn, ...args) {
  if (fn) { fn(...args); }
}
