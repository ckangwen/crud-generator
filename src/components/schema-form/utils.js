function isArray(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

export function deepClone(obj) {
  // 对常见的“非”值，直接返回原来值
  if ([null, undefined, NaN, false].includes(obj)) return obj;
  if (typeof obj !== "object" && typeof obj !== "function") {
    //原始类型直接返回
    return obj;
  }
  const o = isArray(obj) ? [] : {};
  for (const i in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(i)) {
      o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
    }
  }
  return o;
}
