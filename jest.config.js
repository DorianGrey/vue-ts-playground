module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,ts,vue}",
    "!src/**/*.spec.{js,ts}",
    "!src/{index,router}.ts",
    "!src/i18n/**/*.ts",
    "!src/**/*.d.ts"
  ],
  coverageReporters: [
    "lcov",
    "text"
  ],
  coverageDirectory: "<rootDir>/test-results/coverage",
  moduleFileExtensions: [
    "js",
    "jsx",
    "json",
    "vue",
    "ts",
    "tsx"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  "setupTestFrameworkScriptFile": "<rootDir>/config/jest/testSetup.ts",
  snapshotSerializers: [
    "jest-serializer-vue"
  ],
  testMatch: [
    "**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"
  ],
  testURL: "http://localhost/",
  transform: {
    "^.+\\.vue$": "vue-jest",
    "^.+\\.js$": "babel-jest",
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.tsx?$": "ts-jest"
  },
  transformIgnorePatterns: [
    // "[\\\/]node_modules[\\\/](?!(vuetify|lodash-es))"
    "[\\\/]node_modules[\\\/](?!(vuetify|lodash-es)).+\\.(js|ts)$"
  ]
};