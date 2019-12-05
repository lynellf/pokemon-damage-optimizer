const { App } = require("../lib/main");

function app() {
  const answer = App();
  console.log({ answer });
}

app();
