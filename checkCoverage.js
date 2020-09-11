const fs = require("fs");

const params = {
  coverageReportPath: null,
  coverageThreshold: null,
  branchCoverageThreshold: null,
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
  process.exit(1);
}

if (!params.coverageThreshold) {
  console.log("##vso[task.LogIssue type=error;]coverageThreshold is required");
  process.exit(1);
}

let coverageReportBuffer = "";
try {
  coverageReportBuffer = fs.readFileSync(params.coverageReportPath, "utf-8");
} catch (err) {
  console.log(`##vso[task.LogIssue type=error;]${err.message}`);
  process.exit(1);
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
  process.exit(1);
}

const lineCoveragePercentage = coverageReport["coverage"]["$"]["line-rate"] * 100;
if (lineCoveragePercentage < params.coverageThreshold) {
  console.log(`##vso[task.LogIssue type=error;]Line coverage percentage too low. Required: ${params.coverageThreshold} Coverage: ${lineCoveragePercentage}`);
  process.exit(1);
}

const branchCoveragePercentage = coverageReport["coverage"]["$"]["branch-rate"] * 100;
const branchThreshold = params.branchCoverageThreshold || params.coverageThreshold;
if (branchCoveragePercentage < branchThreshold) {
  console.log(`##vso[task.LogIssue type=error;]Branch coverage percentage too low. Required: ${branchThreshold} Coverage: ${branchCoveragePercentage}`);
  process.exit(1);
}
