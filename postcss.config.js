module.exports = {
  plugins: {
    "postcss-flexbugs-fixes": {},
    "autoprefixer": {
      browsers: [
        ">0.25%",
        "not op_mini all",
        "ie 11" // supporting IE < 11 should not be required anymore, due to the lack of usage statistics.
      ],
      flexbox: "no-2009"
    }
  }
};