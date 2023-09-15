const { isObject, isFunction, isString } = require("../utils");
const eventBus = require("../eventBus");

// 利用劫持我们的state，在set的时候emit事件，提供监听和取消监听的函数就能共享状态
class store {
  constructor(options) {
    // store的state必须需要是一个对象
    if (!isObject(options.state)) {
      throw new TypeError("the state must be object type");
    }
    // actions存在，并且是一个对象，我们需要检验里面的是不是一个个函数
    if (!options.actions && isObject(options.actions)) {
      // 获取所以的value
      const values = Object.values(options.actions);
      for (const fn of values) {
        isFunction(fn);
      }
      this.actions = options.actions;
    }
    this.state = options.state;
    // 劫持state对象，监听
    this.observe(options.state);
    // 创建事件总线
    this.event = new eventBus();
    this.event2 = new eventBus();
  }
  // 劫持state,改变值的时候发射事件，传递最新的数据出去
  observe(state) {
    const _this = this;
    Object.keys(state).forEach((key) => {
      let _value = state[key];
      Object.defineProperty(state, key, {
        get() {
          return _value;
        },
        set(newValue) {
          if (_value === newValue) return;
          _value = newValue;
          // 给每个key发射一个事件
          _this.event.emit(key, _value);
          _this.event2.emit(key, { [key]: _value });
        },
      });
    });
  }
  // 监听state的key,获取最新数据
  onState(stateKey, stateCallBack) {
    const keys = Object.keys(this.state);
    // 判断state有没有这个key，判断回调函数是不是一个函数
    if (keys.indexOf(stateKey) === -1) {
      throw new Error(`the state does not contain your ${stateKey}`);
    }
    isFunction(stateCallBack);

    this.event.on(stateKey, stateCallBack);
    stateCallBack.apply(this.state, [this.state[stateKey]]);
  }
  // 监听多个state的key，获取最新数据
  onStates(statekeys, statesCallBack) {
    const keys = Object.keys(this.state);
    const value = {};
    for (const key of statekeys) {
      if (keys.indexOf(key) === -1) {
        throw new Error(`the state does not contain your ${key}`);
      }
      this.event2.on(key, statesCallBack);
      value[key] = this.state[key];
    }
    statesCallBack.apply(this.state, [value]);
  }
  // 设置state的值
  setState(stateKey, stateValue) {
    this.state[stateKey] = stateValue;
  }
  // 派发事件，获取异步函数的数据设置到state里面
  dispatch(actionName, ...args) {
    isString(actionName);
    if (Object.keys(this.actions).indexOf(actionName) === -1) {
      throw new Error("this action name does not exist in action of store");
    }
    const actionFn = this.actions[actionName];
    // 绑定this传递state作为函数的参数，也可以派发传递参数
    actionFn.apply(this, [this.state, ...args]);
  }
  // 移除事件监听，避免内存泄漏
  offState(stateKey, stateCallBack) {
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("the state not contain the key");
    }
    isFunction(stateCallBack);
    this.event.off(stateKey, stateCallBack);
  }
  // 移除多个数据监听，避免内存泄漏
  offStates(stateKeys, stateCallback) {
    const keys = Object.keys(this.state);
    stateKeys.forEach((key) => {
      if (keys.indexOf(key) === -1) {
        throw new Error(`the state does not contain your ${key}`);
      }
      this.eventV2.off(key, stateCallback);
    });
  }
}

module.exports = store;
