# OpenUPM (Alpha)

Open source UPM registry for Unity

[![Netlify Status](https://api.netlify.com/api/v1/badges/5d66cc09-9f99-4b71-936a-317ee6a7b5d3/deploy-status)](https://app.netlify.com/sites/openupm/deploys)
[![Build Pipelines Status](https://dev.azure.com/openupm/openupm/_apis/build/status/openupm.openupm-pipelines?branchName=master)](https://dev.azure.com/openupm/openupm/_build/latest?definitionId=1&branchName=master)

## Development

```bash
yarn docs:dev
yarn server:dev
```

## Directory Structure

```
app/ - website backend
docs/ - website frontend
config/ - configurations
devops/ - devops
migrations/ - backend database migrations
fixtures/ - backend database data fixtures
scripts/ - other scripts
```

## Background Jobs

Use [bee-queue](https://github.com/bee-queue/bee-queue) as job queue.

Define a job

- Job id: `[jobType]:[key]`
- Job payload: json object

| job id                    | job payload |
| ------------------------- | ----------- |
| `build-pkg:[packageName]` | `{}`        |
| `build-rel:[releaseId]`   | `{}`        |
