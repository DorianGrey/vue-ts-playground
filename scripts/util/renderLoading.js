const path = require("path");
const fs = require("fs-extra");
const sass = require("node-sass");

const paths = require("../../config/paths");

module.exports = function() {
  "use strict";

  return new Promise((resolve, reject) => {
    sass.render(
      {
        file: path.resolve(process.cwd(), "src", "styles", "loading.scss"),
        outputStyle: "compressed"
      },
      function(error, result) {
        if (error) {
          reject(error);
        } else {
          const content = JSON.stringify({ css: result.css.toString("UTF-8") });
          fs.ensureDirSync(paths.appGenerated);
          fs.writeFile(
            path.resolve(paths.appGenerated, "loading.scss.json"),
            content,
            err => {
              if (err) {
                reject(err);
              } else {
                resolve(0);
              }
            }
          );
        }
      }
    );
  });
};
