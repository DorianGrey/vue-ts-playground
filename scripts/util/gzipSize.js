const zlib = require("zlib");
const gzipOpts = { level: 6 }; // This level is used by default by many servers like nginx.

function gzipsize(src, opts = gzipOpts) {
  return zlib.gzipSync(src, opts).length;
}

module.exports = {
  gzipsize,
  gzipOpts
};
