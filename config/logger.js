const signale = require("signale");

const log = new signale.Signale({
  stream: process.stdout,
  types: {
    category: {
      badge: ">",
      color: "cyan",
      label: "category"
    }
  }
});
const buildLog = new signale.Signale({ interactive: true });
const asyncLog = signale.scope("async");

module.exports = {
  log,
  buildLog,
  asyncLog
};
