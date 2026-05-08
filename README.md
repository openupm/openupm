# OpenUPM Data Repository

This repository contains OpenUPM curated data and owns the CI gate that verifies
data changes.

## Contents

- `data/`: package and metadata YAML files
- `test/data-packages.js`: data validation test wrapper that runs the shared
  validator from `openupm-next`

## Validate data

```bash
npm install
npm test
```

or run only the validation target:

```bash
npm run test:data
```

The test expects a built `openupm-next` checkout next to this repository, or an
`OPENUPM_NEXT_PATH` environment variable pointing to one. GitHub Actions checks
out and builds `openupm-next` before running the data test.

## Production data deploy

Pushes to `master` run data validation in GitHub Actions. After validation
passes, CI triggers the `openupm/openupm-next` website workflow and updates the
production data checkout through a restricted SSH deploy hook.

The server-side hook and production deployment path are managed outside this
public data repository.
