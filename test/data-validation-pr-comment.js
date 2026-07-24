const assert = require("node:assert/strict");
const { afterEach, describe, it } = require("node:test");

const {
  buildCommentBody,
  formatValidationDetail,
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

  it("parses GitHub log-prefixed validator issue lines", function() {
    const issues = parseValidationIssues(
      "Data validation\tUNKNOWN STEP\t2026-06-26T12:51:58.4703138Z         packages/com.woo.iframework.yml: licenseSpdxId must not be an empty string [package-license-spdx-id-empty]"
    );

    assert.deepEqual(issues, [
      {
        path: "packages/com.woo.iframework.yml",
        message: "licenseSpdxId must not be an empty string",
        code: "package-license-spdx-id-empty",
      },
    ]);
  });

  it("parses GitHub log-prefixed multi-line metadata validator issues", function() {
    const issues = parseValidationIssues(
      [
        "Data validation\tUNKNOWN STEP\t2026-06-09T11:10:18.2120147Z         packages/com.visionpush.unity.yml: packages/com.visionpush.unity.yml metadata should be valid: [",
        "Data validation\tUNKNOWN STEP\t2026-06-09T11:10:18.2124107Z             \"message\": \"Required\"",
        "Data validation\tUNKNOWN STEP\t2026-06-09T11:10:18.2126803Z               \"createdAt\"",
        "Data validation\tUNKNOWN STEP\t2026-06-09T11:10:18.2131577Z         ] [package-metadata-invalid]",
      ].join("\n")
    );

    assert.deepEqual(issues, [
      {
        path: "packages/com.visionpush.unity.yml",
        message: "metadata should be valid: createdAt: Required",
        metadataFields: ["createdAt"],
        code: "package-metadata-invalid",
      },
    ]);
  });

  it("builds multi-field metadata guidance from GitHub log-prefixed validator issues", function() {
    const issues = parseValidationIssues(
      [
        "Data validation\tUNKNOWN STEP\t2026-06-09T11:10:18.2120147Z         packages/com.visionpush.unity.yml: packages/com.visionpush.unity.yml metadata should be valid: [",
        "Data validation\tUNKNOWN STEP\t2026-06-09T11:10:18.2124107Z             \"message\": \"Required\"",
        "Data validation\tUNKNOWN STEP\t2026-06-09T11:10:18.2126803Z               \"aliases\"",
        "Data validation\tUNKNOWN STEP\t2026-06-09T11:10:18.2126803Z               \"createdAt\"",
        "Data validation\tUNKNOWN STEP\t2026-06-09T11:10:18.2131577Z         ] [package-metadata-invalid]",
      ].join("\n")
    );

    const body = buildCommentBody(issues);

    assert.ok(body.includes("Fix required package metadata fields"));
    assert.ok(body.includes("`aliases`, `createdAt`"));
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
    assert.ok(body.includes("Data validation found package metadata issues that can be fixed in this PR:"));
    assert.equal(body.includes("look contributor-fixable"), false);
    assert.ok(body.includes("Fill in `licenseSpdxId`"));
    assert.ok(body.includes("Use an existing topic slug"));
    assert.ok(body.includes("Make the filename match `name`"));
    assert.ok(body.includes("Fix package metadata field `createdAt`"));
    assert.ok(body.includes("(validation error code: `package-license-spdx-id-empty`)"));
  });

  it("covers every explicitly supported contributor-fixable validator code", function() {
    const supportedIssues = [
      [
        "packages/com.example.tool.yml: image field must not use a plain github.com blob URL [package-image-github-blob-url-invalid]",
        "Use a raw GitHub image URL",
      ],
      [
        "packages/com.example.tool.yml: licenseSpdxId must not be an empty string [package-license-spdx-id-empty]",
        "Fill in `licenseSpdxId`",
      ],
      [
        "packages/com.example.tool.yml: licenseSpdxId Nope should be valid [package-license-spdx-id-invalid]",
        "Use a valid SPDX license ID",
      ],
      [
        "packages/com.example.tool.yml: licenseName should be MIT License for licenseSpdxId MIT [package-license-name-spdx-mismatch]",
        "Match `licenseName` to `licenseSpdxId`",
      ],
      [
        "packages/com.example.tool.yml: topic unknown should be valid [package-topic-invalid]",
        "Use an existing topic slug",
      ],
      [
        "packages/com.example.tool.yml: com.example.tool is blocked by scope ^com.example. [package-scope-blocked]",
        "Choose a package name outside blocked scopes",
      ],
      [
        "packages/com.example.tool.yml: pkg.name should match filename without .yml [package-name-filename-mismatch]",
        "Make the filename match `name`",
      ],
      [
        "packages/com.example.tool.yml: repoUrl is required and must not be empty [package-repo-url-empty]",
        "Add `repoUrl`",
      ],
      [
        "packages/com.example.tool.yml: name is required and must not be empty [package-name-empty]",
        "Add `name`",
      ],
      [
        "packages/com.example.tool.yml: licenseName is required and must not be empty [package-license-name-empty]",
        "Add `licenseName`",
      ],
      [
        "packages/com.example.tool.yml: hunter is required and must not be empty [package-hunter-empty]",
        "Add `hunter`",
      ],
    ];

    for (const [line, title] of supportedIssues) {
      const body = buildCommentBody(parseValidationIssues(line));
      assert.ok(body.includes(title));
    }
  });

  it("guides contributors away from plain GitHub blob image URLs", function() {
    const body = buildCommentBody(
      parseValidationIssues(
        "packages/com.example.tool.yml: image field must not use a plain github.com blob URL [package-image-github-blob-url-invalid]"
      )
    );

    assert.ok(body.includes("Use a raw GitHub image URL"));
    assert.ok(body.includes("raw.githubusercontent.com"));
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

  it("formats SPDX license mismatch details with quoted values and a labeled CI code", function() {
    const [issue] = parseValidationIssues(
      "packages/com.example.tool.yml: licenseName should be MIT License for licenseSpdxId MIT [package-license-name-spdx-mismatch]"
    );

    const detail = formatValidationDetail(issue);

    assert.equal(
      detail,
      "`licenseName` should be `MIT License` for `licenseSpdxId` `MIT` (validation error code: `package-license-name-spdx-mismatch`)"
    );
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

  it("updates one marker comment and deletes duplicate markers", async function() {
    const calls = mockFetch([
      {
        response: [
          { id: 1, body: `${marker}\nold`, user: { type: "User" } },
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

  it("deletes stale marker comments when no supported guidance remains", async function() {
    const calls = mockFetch([
      { response: [{ id: 1, body: `${marker}\nold`, user: { type: "User" } }] },
      { status: 204, response: null },
    ]);

    const result = await upsertComment("openupm/openupm", 123, "token", null);

    assert.deepEqual(result, { action: "deleted" });
    assert.equal(calls[1].method, "DELETE");
  });

  it("creates a new comment when no marker comment exists", async function() {
    const calls = mockFetch([
      { response: [{ id: 1, body: "human note", user: { type: "User" } }] },
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
