const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { describe, it } = require("node:test");

const dataDir = path.resolve(__dirname, "../data");
const openupmNextPath = path.resolve(
  process.env.OPENUPM_NEXT_PATH || path.resolve(__dirname, "../../openupm-next")
);
const validateDataCli = path.resolve(
  openupmNextPath,
  "packages/@openupm/local-data/build/cli/validate-data.js"
);

describe("data/packages", function() {
  it("validates OpenUPM data with the shared openupm-next validator", function() {
    assert.ok(
      fs.existsSync(validateDataCli),
      [
        `Missing shared validator CLI at ${validateDataCli}.`,
        "Build openupm-next first, or set OPENUPM_NEXT_PATH to a built checkout.",
      ].join(" ")
    );

    const result = spawnSync(process.execPath, [validateDataCli, dataDir], {
      encoding: "utf8",
      stdio: "pipe",
    });
    assert.equal(
      result.status,
      0,
      [result.stdout, result.stderr].filter(Boolean).join("\n")
    );
  });
});
