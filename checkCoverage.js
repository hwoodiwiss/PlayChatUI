const fs = require("fs");

const params = {
  coverageReportPath: null,
  coverageThreshold: null,
};

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
  console.log("##vso[task.LogIssue type=error;]coverageReportPath is required");
  return 1;
}

if (!params.coverageThreshold) {
  console.log("##vso[task.LogIssue type=error;]coverageThreshold is required");
  return 1;
}

let coverageReportBuffer = "";
try {
  coverageReportBuffer = fs.readFileSync(params.coverageReportPath, "utf-8");
} catch (err) {
  console.log(`##vso[task.LogIssue type=error;]${err.message}`);
  return 1;
}

let coverageReport = null;
let parseError = null;
//Callback is run synchronously, which works well for top-level script
require("xml2js").parseString(coverageReportBuffer, (error, result) => {
  coverageReport = result;
  parseError = error;
});

if (parseError) {
  console.log(`##vso[task.LogIssue type=error;]${parseError}`);
  return 1;
}

const coveragePercentage = coverageReport["coverage"]["$"]["line-rate"] * 100;
if (coveragePercentage < params.coverageThreshold) {
  console.log(`##vso[task.LogIssue type=error;]Coverage percentage too low. Required: ${params.coverageThreshold} Coverage: ${coveragePercentage}`);
  return 1;
}
