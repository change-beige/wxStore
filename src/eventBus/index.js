const { isFunction, isString } = require("../utils");

class eventBus {
  constructor() {
    this.eventMap = {};
  }
  // 监听
  on(eventName, fn, thisArg) {
    // 判断是不是string和函数，不是则抛出异常
    isString(eventName);
    isFunction(fn);
    let eventArray = this.eventMap[eventName];
    if (!eventArray) {
      eventArray = [];
      this.eventMap[eventName] = eventArray;
    }
    eventArray.push({
      fn,
      thisArg,
    });
    return this;
  }
  // 发射事件
  emit(eventName, ...args) {
    // 检验参数名是不是string
    isString(eventName);
    const eventArrays = this.eventMap[eventName] || [];
    eventArrays.forEach((event) => {
      event.fn.apply(event.thisArg, args);
    });
    return this;
  }
  // 监听，当执行一次取消
  once(eventName, fn, thisArg) {
    // 检验参数
    isString(eventName);
    isFunction(fn);
    // 劫持这个函数，当发射执行一次自己移除事件
    const tempFn = (...args) => {
      this.off(eventName, tempFn);
      fn.apply(thisArg, args);
    };
    return this.on(eventName, tempFn, thisArg);
  }
  // 取消事件监听
  off(eventName, fn) {
    // 检验参数，有错误则抛出异常
    isString(eventName);
    isFunction(fn);
    // 获取改事件对应的event函数数组
    const eventArrays = this.eventMap[eventName];
    if (!eventArrays) return;
    const newEventArrays = [...eventArrays];
    for (let i = 0; i < newEventArrays.length; i++) {
      let eventFn = newEventArrays[i];
      // 如果函数相同,找到对应函数的索引值,移除这个函数
      if (eventFn.fn === fn) {
        let index = newEventArrays.indexOf(eventFn);
        eventArrays.splice(index, 1);
      }
    }
    // 如果对应的事件名称的事件为空数组,删除这个数组
    if (eventArrays.length === 0) {
      delete this.eventMap[eventName];
    }
  }
}

module.exports = eventBus;
