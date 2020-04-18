---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# Development

## Architecture

The OpenUPM service is composed of below sub-systems:

- Public upm registry
- *Automatic build pipelines
- *Website frontend
- *Website backend (API)
- *Package curated list
- [OpenUPM-CLI](https://github.com/openupm/openupm-cli) command-line tool

Entries with `*` prefix are located in the [main repository](https://github.com/openupm/openupm).

## Directory Structure

```
.
├── app         # service backend
│   ├── db         # database, Redis
│   ├── jobs       # background jobs
│   ├── models     # models
│   ├── queues     # job queues
│   ├── utils      # useful scripts
│   └── views      # HTTP endpoints
├── config       # configurations
├── data         # data
│   └── packages # package curated list (YAML files)
├── docs         # web frontend (vuepress)
└── tests        # unit tests
```

## Public UPM Registry

OpenUPM uses a custom verdaccio to host the registry. Though verdaccio is the most popular open-source project to set up a private npm registry, most deployments served a very limited user base or for the testing purpose that doesn't care about performance much. OpenUPM try to solve quite a few issues related to the cluster deployment. Before these PRs get merged, OpenUPM will stay with the custom build:

- S3 storage with CDN [#250](https://github.com/verdaccio/monorepo/issues/250)
- Stateless s3 storage for cluster deployment [#1595](https://github.com/verdaccio/verdaccio/issues/1595), [#1459](https://github.com/verdaccio/verdaccio/issues/1459)
- Commands `npm publish -f` and `npm unpublish` return 404 ~~[#1435](https://github.com/verdaccio/verdaccio/issues/1435)~~
- Wrong timestamp for old search api ~~[#1597](https://github.com/verdaccio/verdaccio/issues/1597)~~

Since OpenUPM has it's own way to organize the package list, the verdaccio website and API endpoints are disabled (headless mode).

## Automatic Build Pipelines

OpenUPM watches the package curated list regularly detects new contents and uses the job queue to build packages through [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/).

@flowstart
stage1=>operation: Cron
stage2=>operation: Job queue
stage3=>operation: Azure Pipelines

stage1(right)->stage2(right)->stage3
@flowend

### Job Queue

OpenUPM uses [Bee-Queue](https://github.com/bee-queue/bee-queue) to manage the job queue.

| Job                     | Description                                                  |
|-------------------------|--------------------------------------------------------------|
| `build-pkg:<pkg>`       | fetch repo info and create build-rel jobs for valid git tags |
| `build-rel:<pkg>:<ver>` | build pkg@version via Azure Pipelines                        |

## Website Frontend

OpenUPM uses [VuePress](https://vuepress.vuejs.org) - a static website generator to develop website frontend.

```bash
yarn docs:dev
```

## Website Backend

OpenUPM uses [Express](http://expressjs.com/) to develop website backend (API).

```bash
yarn server:dev
```

## Package Curated List

OpenUPM uses git as a database to maintain the package curated list. Each package is described as a YAML file.
