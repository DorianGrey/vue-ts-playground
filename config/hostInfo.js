const internalIp = require("internal-ip");

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const LOCAL_HOST_ADDRESS = process.env.HOST || "localhost";
const PUBLIC_ADDRESS = internalIp.v4.sync();
const useLocalIp = process.argv.indexOf("--local-network") !== -1;

module.exports = {
  useLocalIp,
  DEFAULT_PORT,
  LOCAL_HOST_ADDRESS,
  PUBLIC_ADDRESS
};
