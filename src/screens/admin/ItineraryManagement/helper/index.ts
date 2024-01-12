export function createUrlIdParams(key: string, array: { id?: string }[]) {
  const result = array?.map((item) => `${key}[]=${item.id}`).join("&");
  return result;
}

export function downloadPdf(url: string, target = "_self") {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = target;
  anchor.click();
  document.body.removeChild(anchor);
}

/**
 * recursive function to deep clone nested objects
 */
export function deepCopy(obj) {
  let rv;

  switch (typeof obj) {
    case "object":
      if (obj === null) {
        // null => null
        rv = null;
      } else {
        switch (toString.call(obj)) {
          case "[object Array]":
            // It's an array, create a new array with
            // deep copies of the entries
            rv = obj.map(deepCopy);
            break;
          case "[object Date]":
            // Clone the date
            rv = new Date(obj);
            break;
          case "[object RegExp]":
            // Clone the RegExp
            rv = new RegExp(obj);
            break;
          // ...probably a few others
          default:
            // Some other kind of object, deep-copy its
            // properties into a new object
            rv = Object.keys(obj).reduce(function (prev, key) {
              prev[key] = deepCopy(obj[key]);
              return prev;
            }, {});
            break;
        }
      }
      break;
    default:
      // It's a primitive, copy via assignment
      rv = obj;
      break;
  }
  return rv;
}
