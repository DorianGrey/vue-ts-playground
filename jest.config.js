module.exports = {
  "collectCoverageFrom": [
    "src/**/*.{js,ts,vue}",
    "!src/**/*.spec.{js,ts}",
    "!src/{index,bootloader}.ts",
    "!src/i18n/**/*.ts"
  ],
  "coverageReporters": [
    "lcov",
    "text"
  ],
  "coverageDirectory": "<rootDir>/test-results/coverage",
  "globals": {
    "ts-jest": {
      "tsConfigFile": "tsconfig.test.json"
    },
    "vue-jest": {
      "tsConfigFile": "tsconfig.test.json",
      "babelRcFile": ".babelrc"
    }
  },
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
    "^.+\\.ts$": "ts-jest",
    ".*\\.(vue)$": "vue-jest"
  },
  "transformIgnorePatterns": [
    "[/\\\\]node_modules[/\\\\].+\\.(js|ts)$"
  ]
};