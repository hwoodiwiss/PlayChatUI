const fs = require("fs");

const params = {
  coverageReportPath: null,
  coverageThreshold: null,
};

(async () => {
  process.argv.reduce((cmd, arg) => {
    if (cmd) {
      params[cmd] = arg;
      return;
    }

    if (arg.startsWith("--")) {
      const sub = arg.substr("--".length);
      if (Object.keys(params).includes(sub)) {
        if (typeof params[sub] === "boolean") {
          params[cmd] = true;
          return;
        }

        return sub;
      }
    }
  });

  if (!params.coverageReportPath) {
    throw new Error("##vso[task.LogIssue type = error;]coverageReportPath is required");
  }

  if (!params.coverageThreshold) {
    throw new Error("##vso[task.LogIssue type = error;]coverageThreshold is required");
  }

  let coverageReportBuffer = "";
  try {
    coverageReportBuffer = fs.readFileSync(params.coverageReportPath, "utf-8");
  } catch (err) {
    throw new Error(`##vso[task.LogIssue type = error;]${err.message}`);
  }

  try {
    const coverageReport = await require("xml2js").parseStringPromise(coverageReportBuffer);
    const coveragePercentage = coverageReport["coverage"]["$"]["line-rate"] * 100;
    if (coveragePercentage < params.coverageThreshold) {
      throw new Error(`##vso[task.LogIssue type = error;]Coverage percentage too low. Required: ${params.coverageThreshold} Coverage: ${coveragePercentage}`);
    }
  } catch (err) {
    throw new Error(`##vso[task.LogIssue type = error;]${err.message}`);
  }
})().catch((err) => {
  throw err;
});
