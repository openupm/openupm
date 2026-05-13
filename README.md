<p align="center">
  <a href="https://openupm.com/">
    <img width="180" src="https://openupm.com/images/openupm-icon-256.png" alt="OpenUPM logo">
  </a>
</p>
<h1 align="center">
  OpenUPM - Open Source Unity Package Registry
</h1>
<p align="center">
  <a href="https://github.com/openupm/openupm/actions">
    <img src="https://github.com/openupm/openupm/workflows/CI/badge.svg" alt="CI status">
  </a>
  <a href="https://discord.gg/FnUgWEP">
    <img src="https://img.shields.io/discord/662675048884207616.svg" alt="Discord">
  </a>
  <a href="https://x.com/openupmupdate">
    <img alt="X Follow" src="https://img.shields.io/twitter/follow/openupmupdate?style=social">
  </a>
</p>
<p align="center">
  <a href="https://openupm.com/">OpenUPM</a>
</p>

## Introduction

OpenUPM is an open-source service for hosting and building open-source Unity
Package Manager (UPM) packages. The goal is to provide a universal place to
discover, distribute, and share open-source UPM packages, and to build a
community around that ecosystem.

OpenUPM is composed of two main service areas:

- A managed [scoped package registry](https://docs.unity3d.com/Manual/upm-scoped.html)
  for hosting UPM packages.
- Automatic build pipelines that track, build, and publish UPM packages from
  Git tags.

> DISCLAIMER: OpenUPM is an open-source service, not an official service
> provided by Unity Technologies Inc.

Learn more in the [OpenUPM documentation](https://openupm.com/docs/).

## Repository role

This repository contains the curated OpenUPM package data and owns the CI gate
that verifies data changes. Application code, website code, API services, jobs,
and shared validator implementation live in
[`openupm/openupm-next`](https://github.com/openupm/openupm-next).

## Contents

- `data/packages/*.yml`: curated package manifests
- `data/*.yml`: shared metadata such as sponsors, backers, built-in packages,
  topics, and blocked scopes
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

## Sponsors and backers

OpenUPM is an independent project with ongoing development made possible by
[sponsors, backers, and contributors](https://openupm.com/contributors/). If
you'd like to support the project, please consider:

- [Sponsoring Favo Yang on Patreon](https://www.patreon.com/openupm)
- [Sponsoring Favo Yang on GitHub](https://github.com/sponsors/openupm)
- [Exploring other donation options](https://openupm.com/support/)

## Ecosystem

| Sub-project | Description |
| --- | --- |
| [openupm.com](https://openupm.com) | Website, documentation, and package discovery |
| [package.openupm.com](https://package.openupm.com) | UPM registry |
| [openupm/openupm](https://github.com/openupm/openupm) | Curated package data and data validation |
| [openupm/openupm-next](https://github.com/openupm/openupm-next) | Website, API, jobs, and shared packages |
| [openupm/openupm-pipelines](https://github.com/openupm/openupm-pipelines) | Package build and publish pipelines |
| [openupm/openupm-cli](https://github.com/openupm/openupm-cli) | Command-line tool |

OpenUPM also uplinks `org.nuget` scoped packages to the OpenUPM-hosted
UnityNuGet registry at <https://unitynuget-registry.openupm.com>, a hosted
project based on [`bdovaz/UnityNuGet`](https://github.com/bdovaz/UnityNuGet).

## Community and contributions

OpenUPM's [Code of Conduct](https://openupm.com/docs/code-of-conduct.html)
applies to this repository.

Bug reports and feature requests are welcome as
[issues](https://github.com/openupm/openupm/issues/new). Please search existing
and closed issues before opening a new one. Unsolicited pull requests to fix
bugs or implement feature requests are not accepted unless a maintainer
explicitly invites them.

You can also:

- Read the blog at [openupm.com/blog](https://openupm.com/blog)
- Discuss ideas in [GitHub Discussions](https://github.com/openupm/openupm/discussions)
- Chat on [Discord](https://discord.gg/FnUgWEP)
- Contact the maintainers at [hello@openupm.com](mailto:hello@openupm.com)
- Track package updates with the [RSS feed](https://openupm.com/feeds/updates/rss)

## Terms and license

- Source code licensed under [BSD-3-Clause](./LICENSE)
- OpenUPM website and public registry [terms of use](https://openupm.com/docs/terms.html)
- [Code of conduct](https://openupm.com/docs/code-of-conduct.html)

## Status

See <https://openupm.github.io/upptime/>.

## Production data deploy

Pushes to `master` run data validation in GitHub Actions. After validation
passes, the website is scheduled to rebuild with the updated package data,
usually within 30 minutes.
