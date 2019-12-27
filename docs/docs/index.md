---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# Introduction

OpenUPM is a service for hosting and building open source unity package manager (upm) packages. It's composed of two parts: a managed upm package registry with an automatic build pipelines. The intention is to create an universal platform to discover, share and distribute open source upm packages, and a community along with it.

::: warning DISCLAIMER
OpenUPM is not an official service provided by Unity Technologies Inc.
:::

## How It Works

### Scope Registry and Command Line Interface

Unity supports [scoped registry](https://docs.unity3d.com/Manual/upm-scoped.html) which allows developer to use 3rd-party registry to host their own packages. OpenUPM provides an upm registry as a scoped registry at `https://package.openupm.com` to host all packages.

However, the downside of the scoped registry is that you need specify the scopes to make it work probably in the unity package manager UI. That's not a problem when work with your own single namespace, i.e. `com.companyname`. But can be really challenge for a public registry which hosts various packages with all different namespaces. It's a headache work for developer to maintain the [project manifest json file](https://docs.unity3d.com/Manual/upm-manifestPrj.html) for adding or removing the scopes.

To solve the issue, as the first step, a command line interface [openupm-cli](https://github.com/openupm/openupm-cli) is created to help maintain the manifest file. With the cli, you can add, remove, search, view package(s) in various terminal environments like bash for Mac and Linux, or git-bash, cmd and powershell for Windows.

@flowstart
cli=>operation: OpenUPM-CLI
manifest=>operation: Update manifest.json
upm=>end: Unity resolves manifest.json

cli(right)->manifest
manifest(right)->upm
@flowend

```sh
# Install openupm-cli
$ npm install -g openupm-cli
# OR yarn global add openupm-cli

# Enter your unity project folder
$ cd YOUR_UNITY_PROJECT_FOLDER

# Search a package
$ openupm search addressable-importer
┌───────────────────────────────────────┬─────────┬───────────┬────────────┐
│ Name                                  │ Version │ Author    │ Date       │
├───────────────────────────────────────┼─────────┼───────────┼────────────┤
│ com.littlebigfun.addressable-importer │ 0.4.1   │ Favo Yang │ 2019-11-25 │
│ Unity Addressable Importer            │         │           │            │
└───────────────────────────────────────┴─────────┴───────────┴────────────┘

# Install package
$ openupm add com.littlebigfun.addressable-importer
added: com.littlebigfun.addressable-importer@0.4.1
manifest updated, please open unity project to apply changes
```

Please visit [openupm-cli readme](https://github.com/openupm/openupm-cli#openupm-cli) for usage.

A seamlessly unity editor integration may come in 2020.

### Automatic Build Pipelines

OpenUPM maintains a [curated list](https://github.com/openupm/openupm/tree/master/data/packages) of open source upm repositories hosting on GitHub. The build pipelines monitor the list, detect valid git tags of each repository, and publish new releases automatically. This is different with the traditional package registry which requires package maintainer to publish releases regularly. The automatic process simplified the package publishing process. And as a side effect, anyone with a GitHub account can contribute an upm package repository to the build pipelines, so called the package hunter to help the platform grow.

## Why Not ...?

### Unity Asset Store

[Unity asset store](https://assetstore.unity.com/) is the official solution for publishing software SDKs, asset packs and services, offering both paid and free contents. It has a progressive way to convert it's large libraries to compatible with upm package format.

OpenUPM is focused on open source upm package from day one. Open source brings benefits like high quality software, better collaboration, lesser costs... will eventually plays an important role for unity development.

### Other 3rd-party Registries

The other 3rd-party registries like [xcrew.dev](https://xcrew.dev/), [upm-packages.dev](https://upm-packages.dev/) and [unitynuget-registry](https://unitynuget-registry.azurewebsites.net) offers valuable contents and usually maintained by a few passionate developers regularly.

If the package repository is available and in compliance with open source license, upm structure and valid git tags, then it could be added to OpenUPM without changes, unless it requires a custom build process. OpenUPM doesn't require the package owner to publish a package. It allows any GitHub user to contribute new discovered package, and may grow faster with the community.

In fact that openupm-cli is designed to support any 3rd-party registries when passing [registry option](https://github.com/openupm/openupm-cli#command-options). An example to search unitynuget-registry.

```sh
$ openupm search memory --registry=https://unitynuget-registry.azurewebsites.net
┌───────────────────────────┬──────────────────────┬────────────┬──────────┐
│ Name                      │ Version              │ Author     │ Date     │
├───────────────────────────┼──────────────────────┼────────────┼──────────┤
│ org.nuget.system.memory   │ 4.5.3                │            │          │
└───────────────────────────┴──────────────────────┴────────────┴──────────┘
```

### Awesome-upm and UpmGitExtension

[Awesome-upm](https://github.com/starikcetin/awesome-upm) is a curated list of upm git repositories. [UpmGitExtension](https://github.com/mob-sakai/UpmGitExtension) provides a better way to install upm packages like git tag based version management and [dependency resolver](https://github.com/mob-sakai/GitDependencyResolverForUnity). They work really well together.

Though UpmGitExtension is based on git, the experience may look similar comparing with OpenUPM registry. In addition to package registry, OpenUPM platform offers better package discovery and contribution process.

## Open Source Power

OpenUPM is an open source service. It's impossible to make it work without below amazing projects and services.

Open source projects

- [Verdaccio](https://github.com/picturepan2/spectre) for package registry (modified for scalability)
- [Vuepress](https://github.com/picturepan2/spectre) for website and docs
- [Spectre](https://github.com/picturepan2/spectre) for styling

 Open source friendly services

- [Digital Ocean](https://m.do.co/c/50e7f9860fa9) for hosting registry
- Azure Pipelines for build pipelines
- Netlify for hosting website
- GitHub and GitHub actions for DVCS and CI
