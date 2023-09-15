const store = require("../src/store");

const eventStore = new store({
  state: {
    name: "why",
    friends: ["abc", "cba", "nba"],
    banners: [],
    recommends: [],
  },
  actions: {
    fetchData(ctx) {
      console.log(ctx);
    },
  },
});

// 数据监听
eventStore.onState("name", (value) => {
  console.log("监听name:", value);
});

eventStore.onState("friends", (value) => {
  console.log("监听friends:", value);
});

// eventStore.onState("banners", (value) => {
//   console.log("监听banners:", value);
// });

// eventStore.onState("recommends", (value) => {
//   console.log("监听recommends", value);
// });

// eventStore.setState("banner", ["11", "22"]);

// 同时监听多个数据;
eventStore.onStates(["name", "friends"], (value) => {
  console.log("监听多个数据:", value); // 数组类型
});

// // 数据变化
setTimeout(() => {
  eventStore.setState("name", "lilei");
  eventStore.setState("friends", ["kobe", "james"]);
}, 1000);

// eventStore.dispatch("fetchData");
