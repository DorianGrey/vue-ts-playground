module.exports = {
  "collectCoverageFrom": [
    "src/**/*.{js,ts,vue}",
    "!src/**/*.spec.{js,ts}",
    "!src/{index,bootloader}.ts"
  ],
  "coverageReporters": [
    "lcov",
    "text"
  ],
  "coverageDirectory": "./test-results/coverage",
  "globals": {
    "ts-jest": {
      "tsConfigFile": "tsconfig.test.json"
    }
  },
  "mapCoverage": true,
  "moduleFileExtensions": [
    "js",
    "ts",
    "vue"
  ],
  "moduleDirectories": [
    "node_modules",
    "src"
  ],
  "moduleNameMapper": {
    "^vue$": "vue/dist/vue.common.js"
  },
  "testMatch": [
    "<rootDir>/src/**/?(*.)spec.ts"
  ],
  "setupTestFrameworkScriptFile": "<rootDir>/config/jest/testSetup.ts",
  "transform": {
    "^.+\\.(svg|gif|png|jpe?g)$": "<rootDir>/config/jest/fileTransform.js",
    "^.+\\.s?css$": "<rootDir>/config/jest/cssTransform.js",
    "^.+\\.ts$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    ".*\\.(vue)$": "<rootDir>/config/jest/vueTransform.js"
  },
  "transformIgnorePatterns": [
    "[/\\\\]node_modules[/\\\\].+\\.(js|ts)$"
  ]
};