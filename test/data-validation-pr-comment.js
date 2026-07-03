const assert = require("node:assert/strict");
const { afterEach, describe, it } = require("node:test");

const {
  buildCommentBody,
  marker,
  parseValidationIssues,
  upsertComment,
} = require("../scripts/data-validation-pr-comment");

const originalFetch = global.fetch;

describe("data-validation-pr-comment", function() {
  afterEach(function() {
    global.fetch = originalFetch;
  });

  it("parses validator issue lines", function() {
    const issues = parseValidationIssues(
      [
        "packages/com.example.tool.yml: licenseSpdxId must not be an empty string [package-license-spdx-id-empty]",
        "packages/com.example.tool.yml metadata should be valid: createdAt: Required [package-metadata-invalid]",
        "topics.yml should be valid YAML: bad indentation [top-level-yaml-invalid]",
      ].join("\n")
    );

    assert.deepEqual(issues, [
      {
        path: "packages/com.example.tool.yml",
        message: "licenseSpdxId must not be an empty string",
        code: "package-license-spdx-id-empty",
      },
      {
        path: "packages/com.example.tool.yml",
        message: "metadata should be valid: createdAt: Required",
        code: "package-metadata-invalid",
      },
      {
        path: undefined,
        message: "topics.yml should be valid YAML: bad indentation",
        code: "top-level-yaml-invalid",
      },
    ]);
  });

  it("builds one contributor-facing comment for common package fixes", function() {
    const issues = parseValidationIssues(
      [
        "packages/com.example.tool.yml: licenseSpdxId must not be an empty string [package-license-spdx-id-empty]",
        "packages/com.example.tool.yml: topic unknown should be valid [package-topic-invalid]",
        "packages/com.example.tool.yml: pkg.name should match filename without .yml [package-name-filename-mismatch]",
        "packages/com.example.tool.yml metadata should be valid: createdAt: Required [package-metadata-invalid]",
      ].join("\n")
    );

    const body = buildCommentBody(issues);

    assert.ok(body.includes(marker));
    assert.ok(body.includes("Fill in `licenseSpdxId`"));
    assert.ok(body.includes("Use an existing topic slug"));
    assert.ok(body.includes("Make the filename match `name`"));
    assert.ok(body.includes("Fix package metadata field `createdAt`"));
  });

  it("covers every explicitly supported contributor-fixable validator code", function() {
    const supportedLines = [
      "packages/com.example.tool.yml: licenseSpdxId must not be an empty string [package-license-spdx-id-empty]",
      "packages/com.example.tool.yml: licenseSpdxId Nope should be valid [package-license-spdx-id-invalid]",
      "packages/com.example.tool.yml: licenseName should be MIT License for licenseSpdxId MIT [package-license-name-spdx-mismatch]",
      "packages/com.example.tool.yml: topic unknown should be valid [package-topic-invalid]",
      "packages/com.example.tool.yml: com.example.tool is blocked by scope ^com.example. [package-scope-blocked]",
      "packages/com.example.tool.yml: pkg.name should match filename without .yml [package-name-filename-mismatch]",
      "packages/com.example.tool.yml: repoUrl is required and must not be empty [package-repo-url-empty]",
      "packages/com.example.tool.yml: name is required and must not be empty [package-name-empty]",
      "packages/com.example.tool.yml: licenseName is required and must not be empty [package-license-name-empty]",
      "packages/com.example.tool.yml: hunter is required and must not be empty [package-hunter-empty]",
    ];

    const body = buildCommentBody(parseValidationIssues(supportedLines.join("\n")));

    assert.ok(body.includes("Fill in `licenseSpdxId`"));
    assert.ok(body.includes("Use a valid SPDX license id"));
    assert.ok(body.includes("Match `licenseName` to `licenseSpdxId`"));
    assert.ok(body.includes("Use an existing topic slug"));
    assert.ok(body.includes("Choose a package name outside blocked scopes"));
    assert.ok(body.includes("Make the filename match `name`"));
    assert.ok(body.includes("Add `repoUrl`"));
    assert.ok(body.includes("Add `name`"));
  });

  it("covers supported metadata schema field guidance", function() {
    const fields = [
      "name",
      "aliases",
      "repoUrl",
      "displayName",
      "description",
      "licenseSpdxId",
      "licenseName",
      "topics",
      "hunter",
      "createdAt",
      "trackingMode",
    ];

    for (const field of fields) {
      const body = buildCommentBody(
        parseValidationIssues(
          `packages/com.example.tool.yml metadata should be valid: ${field}: Required [package-metadata-invalid]`
        )
      );

      assert.ok(body.includes(`Fix package metadata field \`${field}\``));
    }
  });

  it("leaves generic CI guidance for ambiguous non-package validation failures", function() {
    const issues = parseValidationIssues(
      "blocked-scopes.yml should be valid YAML: bad indentation [top-level-yaml-invalid]"
    );

    const body = buildCommentBody(issues);

    assert.ok(body.includes("does not have specific guidance"));
    assert.ok(body.includes("Data validation` CI report"));
  });

  it("leaves generic CI guidance for unsupported package issue codes", function() {
    const issues = parseValidationIssues(
      "packages/com.example.tool.yml: alias com.example.old should not be repeated [package-alias-duplicate]"
    );

    const body = buildCommentBody(issues);

    assert.ok(body.includes("does not have specific guidance"));
    assert.ok(body.includes("Data validation` CI report"));
  });

  it("does not duplicate equivalent human guidance", function() {
    const issues = parseValidationIssues(
      "packages/com.example.tool.yml: licenseSpdxId must not be an empty string [package-license-spdx-id-empty]"
    );

    const body = buildCommentBody(issues, [
      {
        body: "Please fix licenseSpdxId because it cannot be an empty string.",
        user: { type: "User" },
      },
    ]);

    assert.equal(body, null);
  });

  it("still comments on distinct fixes when one fix already has human guidance", function() {
    const issues = parseValidationIssues(
      [
        "packages/com.example.tool.yml: licenseSpdxId must not be an empty string [package-license-spdx-id-empty]",
        "packages/com.example.tool.yml: topic unknown should be valid [package-topic-invalid]",
      ].join("\n")
    );

    const body = buildCommentBody(issues, [
      {
        body: "Please fix licenseSpdxId because it cannot be an empty string.",
        user: { type: "User" },
      },
    ]);

    assert.ok(body.includes("Use an existing topic slug"));
    assert.equal(body.includes("Fill in `licenseSpdxId`"), false);
  });

  it("comments on supported issues and adds generic guidance for unsupported issues in the same run", function() {
    const issues = parseValidationIssues(
      [
        "packages/com.example.tool.yml: alias com.example.old should not be repeated [package-alias-duplicate]",
        "packages/com.example.tool.yml: topic unknown should be valid [package-topic-invalid]",
      ].join("\n")
    );

    const body = buildCommentBody(issues);

    assert.ok(body.includes("Use an existing topic slug"));
    assert.ok(body.includes("Other validation failure details"));
    assert.equal(body.includes("alias com.example.old"), false);
  });

  it("does not treat hunter and repository owner differences as an issue", function() {
    const issues = parseValidationIssues(
      "packages/com.example.tool.yml: hunter is required and must not be empty [package-hunter-empty]"
    );

    const body = buildCommentBody(issues);

    assert.ok(body.includes("Add `hunter`"));
    assert.ok(body.includes("does not have to match the package repository owner"));
  });

  it("creates a marker comment when none exists", async function() {
    const calls = mockFetch([{ response: [] }, { response: { id: 10 } }]);

    const result = await upsertComment("openupm/openupm", 123, "token", `${marker}\nbody`);

    assert.deepEqual(result, { action: "created" });
    assert.equal(calls[0].method, "GET");
    assert.equal(calls[1].method, "POST");
    assert.equal(JSON.parse(calls[1].body).body, `${marker}\nbody`);
  });

  it("updates one bot marker comment and deletes duplicate bot markers", async function() {
    const calls = mockFetch([
      {
        response: [
          { id: 1, body: `${marker}\nold`, user: { type: "Bot" } },
          { id: 2, body: `${marker}\nduplicate`, user: { type: "Bot" } },
        ],
      },
      { response: { id: 1 } },
      { status: 204, response: null },
    ]);

    const result = await upsertComment("openupm/openupm", 123, "token", `${marker}\nnew`);

    assert.deepEqual(result, { action: "updated" });
    assert.equal(calls[1].method, "PATCH");
    assert.equal(calls[1].url, "https://api.github.com/repos/openupm/openupm/issues/comments/1");
    assert.equal(calls[2].method, "DELETE");
    assert.equal(calls[2].url, "https://api.github.com/repos/openupm/openupm/issues/comments/2");
  });

  it("deletes stale bot marker comments when no supported guidance remains", async function() {
    const calls = mockFetch([
      { response: [{ id: 1, body: `${marker}\nold`, user: { type: "Bot" } }] },
      { status: 204, response: null },
    ]);

    const result = await upsertComment("openupm/openupm", 123, "token", null);

    assert.deepEqual(result, { action: "deleted" });
    assert.equal(calls[1].method, "DELETE");
  });

  it("does not update or delete a human marker comment", async function() {
    const calls = mockFetch([
      { response: [{ id: 1, body: `${marker}\nhuman note`, user: { type: "User" } }] },
      { response: { id: 2 } },
    ]);

    const result = await upsertComment("openupm/openupm", 123, "token", `${marker}\nnew`);

    assert.deepEqual(result, { action: "created" });
    assert.equal(calls[1].method, "POST");
  });
});

function mockFetch(responses) {
  const calls = [];
  global.fetch = async (url, options = {}) => {
    calls.push({ url, ...options });
    const next = responses.shift();
    if (!next) throw new Error(`Unexpected fetch call: ${options.method} ${url}`);
    return {
      ok: next.status ? next.status >= 200 && next.status < 300 : true,
      status: next.status || 200,
      json: async () => next.response,
      text: async () => JSON.stringify(next.response),
    };
  };
  return calls;
}
