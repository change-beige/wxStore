const eventBus = require("../src/eventBus/index");

const eventBus1 = new eventBus();

function foo(name, age) {
  console.log("click exec", name, age);
}
function bar(name) {
  console.log("bar exec", name);
}

eventBus1.on("click", foo);
eventBus1.once("bar", bar);

setTimeout(() => {
  eventBus1.emit("click", "why", 199);
  eventBus1.emit("bar", "lisi");
}, 2000);

setTimeout(() => {
  eventBus1.off("click", foo);
  eventBus1.emit("bar", "lisi");
}, 3000);

setTimeout(() => {
  eventBus1.emit("click", "coder", 199);
}, 4000);
