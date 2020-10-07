module.exports = {
  preset: "jest-preset-angular",
  reporters: ["default", "jest-junit"],
  collectCoverage: true,
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "cobertura"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  transformIgnorePatterns: ["node_modules/(?!(ol)/)"],
  setupFilesAfterEnv: ["./setupJest.ts", "./jestTypes.ts"],
};
