#!/usr/bin/env node
const fs = require("fs");

const marker = "<!-- openupm-data-validation-comment -->";
const githubApiBase = process.env.GITHUB_API_URL || "https://api.github.com";

const fixableIssues = {
  "package-license-spdx-id-empty": {
    title: "Fill in `licenseSpdxId` or set it to `null`",
    guidance:
      "`licenseSpdxId` cannot be an empty string. Use a valid SPDX id such as `MIT`, or use `null` for a custom/non-SPDX license.",
    duplicateTerms: ["licensespdxid", "empty string"],
  },
  "package-license-spdx-id-invalid": {
    title: "Use a valid SPDX license id",
    guidance:
      "`licenseSpdxId` must match an SPDX license id, for example `MIT`, `Apache-2.0`, or `BSD-3-Clause`.",
    duplicateTerms: ["licensespdxid", "spdx"],
  },
  "package-license-name-spdx-mismatch": {
    title: "Match `licenseName` to `licenseSpdxId`",
    guidance:
      "When `licenseSpdxId` is set, `licenseName` must use the canonical SPDX license name reported by validation.",
    duplicateTerms: ["licensename", "licensespdxid"],
  },
  "package-topic-invalid": {
    title: "Use an existing topic slug",
    guidance:
      "`topics` must contain OpenUPM topic slugs that already exist in `data/topics.yml`.",
    duplicateTerms: ["topic", "topics.yml"],
  },
  "package-scope-blocked": {
    title: "Choose a package name outside blocked scopes",
    guidance:
      "The submitted package name matches a blocked scope. Rename the package metadata or ask a maintainer if the scope should be allowed.",
    duplicateTerms: ["blocked", "scope"],
  },
  "package-name-filename-mismatch": {
    title: "Make the filename match `name`",
    guidance:
      "The package file must be named after the package id, for example `data/packages/com.example.tool.yml` for `name: com.example.tool`.",
    duplicateTerms: ["filename", "name"],
  },
  "package-repo-url-empty": {
    title: "Add `repoUrl`",
    guidance: "`repoUrl` is required and must point to the package source repository.",
    duplicateTerms: ["repourl"],
  },
  "package-name-empty": {
    title: "Add `name`",
    guidance: "`name` is required and must contain the Unity package id.",
    duplicateTerms: ["name", "required"],
  },
  "package-license-name-empty": {
    title: "Add `licenseName`",
    guidance: "`licenseName` is required. Use the license name shown by the repository or SPDX.",
    duplicateTerms: ["licensename"],
  },
  "package-hunter-empty": {
    title: "Add `hunter`",
    guidance:
      "`hunter` is required and should be the GitHub user who submitted or maintains the package metadata. It does not have to match the package repository owner.",
    duplicateTerms: ["hunter"],
  },
};

const metadataRequiredFields = [
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

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`);
    }
    const name = arg.slice(2);
    if (name === "dry-run") {
      args.dryRun = true;
      continue;
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${name}`);
    }
    args[name] = value;
    index += 1;
  }
  return args;
}

function parseValidationIssues(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .map(parseValidationIssueLine)
    .filter(Boolean)
}

function parseValidationIssueLine(line) {
  const match = line.match(/^(?<message>.+) \[(?<code>[a-z0-9-]+)\]$/);
  if (!match) return null;

  const issue = {
    path: undefined,
    message: match.groups.message,
    code: match.groups.code,
  };

  const metadataMatch = issue.message.match(
    /^(?<path>packages\/\S+\.yml) metadata should be valid: (?<detail>.+)$/
  );
  if (metadataMatch) {
    return {
      ...issue,
      path: metadataMatch.groups.path,
      message: `metadata should be valid: ${metadataMatch.groups.detail}`,
    };
  }

  const pathMatch = issue.message.match(
    /^(?<path>packages\/\S+|[A-Za-z0-9_.-]+\.ya?ml|packages): (?<detail>.+)$/
  );
  if (pathMatch) {
    return {
      ...issue,
      path: pathMatch.groups.path,
      message: pathMatch.groups.detail,
    };
  }

  return issue;
}

function metadataGuidance(issue) {
  if (issue.code !== "package-metadata-invalid") return null;
  const field = metadataRequiredFields.find((candidate) =>
    new RegExp(`\\b${candidate}\\b`, "i").test(issue.message)
  );
  if (!field) return null;
  return {
    title: `Fix package metadata field \`${field}\``,
    guidance: `The package YAML is missing or has an invalid \`${field}\` value. Please update that field in the submitted package file.`,
    duplicateTerms: [field.toLowerCase()],
  };
}

function contributorFixForIssue(issue) {
  return fixableIssues[issue.code] || metadataGuidance(issue);
}

function normalizeBody(body) {
  return String(body || "").toLowerCase();
}

function hasExistingMaintainerGuidance(comments, fix) {
  return comments.some((comment) => {
    const body = normalizeBody(comment.body);
    if (body.includes(marker)) return false;
    const userType = comment.user && comment.user.type;
    if (userType === "Bot") return false;
    return fix.duplicateTerms.every((term) => body.includes(term.toLowerCase()));
  });
}

function buildCommentBody(issues, comments = []) {
  const analyzed = issues.map((issue) => ({
    issue,
    fix: contributorFixForIssue(issue),
  }));
  const fixable = analyzed
    .filter((entry) => entry.fix)
    .filter((entry) => !hasExistingMaintainerGuidance(comments, entry.fix));
  const unsupported = analyzed.filter((entry) => !entry.fix);

  if (fixable.length === 0 && unsupported.length === 0) return null;

  const lines = [
    marker,
    fixable.length > 0
      ? "Data validation found package metadata issues that look contributor-fixable:"
      : "Data validation failed, but this bot does not have specific guidance for the reported reason.",
    "",
  ];

  for (const { issue, fix } of fixable.slice(0, 8)) {
    const location = issue.path ? ` in \`${issue.path}\`` : "";
    lines.push(`- ${fix.title}${location}: ${fix.guidance}`);
    lines.push(`  Validation detail: ${issue.message} \`${issue.code}\``);
  }

  if (fixable.length > 8) {
    lines.push(`- ${fixable.length - 8} additional fixable validation issue(s) were omitted from this summary.`);
  }

  if (unsupported.length > 0) {
    if (fixable.length > 0) lines.push("");
    lines.push(
      "Other validation failure details are only available in the `Data validation` CI report. Please open that check and review the full log."
    );
  }

  lines.push("");
  lines.push("Please update the package data and push another commit to rerun validation.");
  return lines.join("\n");
}

async function githubRequest(method, path, token, body) {
  const response = await fetch(`${githubApiBase}${path}`, {
    method,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "x-github-api-version": "2022-11-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${method} ${path} failed with ${response.status}: ${text}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function listComments(repo, issue, token) {
  return githubRequest(
    "GET",
    `/repos/${repo}/issues/${issue}/comments?per_page=100`,
    token
  );
}

async function upsertComment(repo, issue, token, body) {
  const comments = await listComments(repo, issue, token);
  const markerComments = comments.filter((comment) =>
    String(comment.body || "").includes(marker) &&
    comment.user &&
    comment.user.type === "Bot"
  );

  if (!body) {
    await Promise.all(
      markerComments.map((comment) =>
        githubRequest("DELETE", `/repos/${repo}/issues/comments/${comment.id}`, token)
      )
    );
    return { action: markerComments.length ? "deleted" : "skipped" };
  }

  const [first, ...extra] = markerComments;
  if (first) {
    await githubRequest("PATCH", `/repos/${repo}/issues/comments/${first.id}`, token, {
      body,
    });
    await Promise.all(
      extra.map((comment) =>
        githubRequest("DELETE", `/repos/${repo}/issues/comments/${comment.id}`, token)
      )
    );
    return { action: "updated" };
  }

  await githubRequest("POST", `/repos/${repo}/issues/${issue}/comments`, token, {
    body,
  });
  return { action: "created" };
}

async function run(argv = process.argv) {
  const args = parseArgs(argv);
  if (!args["validation-output"]) {
    throw new Error("--validation-output is required");
  }

  const output = fs.readFileSync(args["validation-output"], "utf8");
  const issues = parseValidationIssues(output);
  let comments = [];
  if (args["comments-json"]) {
    comments = JSON.parse(fs.readFileSync(args["comments-json"], "utf8"));
  } else if (args.repo && args.issue && process.env.GITHUB_TOKEN) {
    comments = await listComments(args.repo, args.issue, process.env.GITHUB_TOKEN);
  }

  const body = buildCommentBody(issues, comments);
  if (args.output) {
    if (body) fs.writeFileSync(args.output, `${body}\n`, "utf8");
    else if (fs.existsSync(args.output)) fs.rmSync(args.output);
  }

  if (args.dryRun || !args.repo || !args.issue) {
    if (body) console.log(body);
    else console.log("No data validation comment generated.");
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is required to post a comment");
  const result = await upsertComment(args.repo, args.issue, token, body);
  console.log(`Data validation PR comment ${result.action}.`);
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  buildCommentBody,
  marker,
  parseValidationIssues,
  upsertComment,
};
