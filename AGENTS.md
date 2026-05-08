# Repository Guidelines

## Project Structure & Module Organization

This repository stores curated OpenUPM package data and the validation wrapper used by CI.

- `data/packages/*.yml`: one package manifest per Unity package, named after the package id, for example `com.example.tool.yml`.
- `data/*.yml`: shared metadata lists such as sponsors, backers, built-in packages, and blocked scopes.
- `test/data-packages.js`: Node test that runs the shared validator from `openupm-next`.
- `package.json` and `package-lock.json`: npm metadata and pinned test dependencies.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm test`: run the full repository test suite. Currently this aliases `npm run test:data`.
- `npm run test:data`: validate `data/` with the built validator from `openupm-next`.

The data test expects a built `openupm-next` checkout next to this repository at `../openupm-next`, or set `OPENUPM_NEXT_PATH=/path/to/openupm-next`. Build `openupm-next` before running validation locally.

When searching, remember `rg` skips hidden paths by default. Use `rg --hidden ...` when hidden project directories need to be included.

When staging the `openupm-next/apps/docs` dev server for browser testing, bind to `0.0.0.0` so LAN users can visit it.

## Coding Style & Naming Conventions

Use JavaScript CommonJS style for tests and scripts, matching the existing `require(...)` pattern. Use two-space indentation in YAML package files and keep package keys in the established order where practical.

Package manifest filenames must match the package `name` field, for example `data/packages/com.vendor.package.yml`. Prefer lowercase Unity package ids and existing topic names.

## Testing Guidelines

Tests use Node's built-in `node:test` module and `node:assert/strict`. Add focused tests under `test/` when changing validation behavior. For data-only changes, run `npm test` and ensure the shared validator reports no schema, tracking, license, or metadata errors.

## Commit & Pull Request Guidelines

Use `chore(data): ...` for package CRUD and metadata-only changes, for example `chore(data): add com.vendor.package` or `chore(data): delist com.vendor.package`. Because package submission PRs are often auto-merged, history may also contain generated subjects such as `Create com.vendor.package.yml` or `Rename package from old.id to new.id`; do not treat those as the preferred manual style.

Pull requests should describe the package or metadata change, link related issues when available, and include validation results. For package additions or renames, mention the package id, repository URL, tracking mode, license, and any localization fields touched. Screenshots are only useful when changing images or display metadata.

Before creating GitHub issues or opening PRs that manipulate package data, read `.github/ISSUE_TEMPLATE/`. The templates document expected workflows for package replacement, unpublish requests, bug reports, feature requests, and abuse reports.

## Security & Configuration Tips

Treat tokens and deploy settings as sensitive. Do not introduce secrets into tracked files; prefer environment variables or ignored local configuration.
