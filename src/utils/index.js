function isObject(obj) {
  var type = typeof obj;
  return type === "object" && !!obj;
}

function isString(string) {
  if (typeof string !== "string") {
    throw new TypeError("the event name must be string type");
  }
}

function isFunction(fn) {
  if (typeof fn !== "function") {
    throw new TypeError("the event callback must be function type");
  }
}

module.exports = {
  isObject,
  isString,
  isFunction,
};
