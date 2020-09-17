---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# Introduction

OpenUPM is a service for hosting and building open source UPM (Unity Package Manager) packages. It's composed of two parts: a managed UPM registry and automatic build pipelines. The intention is to create a universal platform to discover, share and distribute open-source UPM packages.

::: warning DISCLAIMER
OpenUPM is not an official service provided by Unity Technologies Inc.
:::

## How It Works

### Scope Registry and Command-Line Tool

Unity supports [scoped registry](https://docs.unity3d.com/Manual/upm-scoped.html) that allowing developers to setup 3rd-party registries to host custom packages. OpenUPM provides a public UPM registry at `https://package.openupm.com`, and a group of services and tools to support it.

However, the downside of the scoped registry is that you need [maintain the scope field](https://docs.unity3d.com/Manual/upm-manifestPrj.html) to make it work. That's not a problem when work with a single namespace, but can be really challenge to manage a public registry with various packages and namespaces. Custom package dependencies make the issue worse, thinking about that package-a depends on package-b, while package-b depends on package-c. All three namespaces should be added to the scope field.

To solve the issue, as the first step, a command-line tool [openupm-cli](https://github.com/openupm/openupm-cli) is created to maintain the project manifest file. You can add, remove, search, view package(s) in a terminal app, like Bash for Mac/Linux, or Git-Bash, CMD, and PowerShell for Windows.

```
+-----+   update   +---------------+   resolve   +-----+
| CLI | ---------> | manifest.json | <---------- | UPM |
+-----+            +---------------+             +-----+
```

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

Please visit [openupm-cli readme](https://github.com/openupm/openupm-cli#openupm-cli) for more usages.

A seamlessly unity editor integration may come in 2020, see [#10](https://github.com/openupm/openupm/issues/10).

### Automatic Build Pipelines

OpenUPM maintains a [curated list](https://github.com/openupm/openupm/tree/master/data/packages) of open source UPM repositories hosting on GitHub. The build pipelines monitoring the list, detecting valid Git tags and publishing new package releases. The continuous publishing approach is different with the traditional package registry that requires the package owner/maintainer to submit publish releases manually. Though the CI tool delivers a similar continuous publishing experience, while the way OpenUPM works enabling not only packager owners/maintainers, but any developers with a GitHub account to contribute new UPM packages to the platform. The later role is called the [package hunter](/contributors/) to help the platform grow faster.

## Why Not ...?

### Unity Asset Store

[Unity asset store](https://assetstore.unity.com/) is the official solution for publishing software SDKs, asset packs and services, offering both paid and free content. Since Unity 2019.3, developers can download the installed assets directly from the UPM window. However assets are installed into the Asset folder, the old fashion way is designed for managing assets. Lacking the dependency management make it not good enough for managing libraries and tools. Unity has a progressive way to encourage it's large contents to convert to UPM format. But it takes years to achieve that.

OpenUPM is focusing on open-source UPM packages from day one. The open-source Unity community is not very strong at the moment, but growing fast, and will eventually play an important role of Unity development.

### Other 3rd-party Registries

The other 3rd-party registries like [xcrew.dev](https://xcrew.dev/), [upm-packages.dev](https://upm-packages.dev/) and [unitynuget-registry](https://unitynuget-registry.azurewebsites.net) offering valuable contents and usually maintained by a few passionate developers.

If repositories of these UPM packages are hosting on GitHub, then they could be contributed to the OpenUPM platform as well.

In fact that openupm-cli is designed to support any 3rd-party registries when specifying the [registry option](https://github.com/openupm/openupm-cli#command-options). i.e. search the unitynuget-registry.

```sh
$ openupm search memory --registry=https://unitynuget-registry.azurewebsites.net
┌───────────────────────────┬──────────────────────┬────────────┬──────────┐
│ Name                      │ Version              │ Author     │ Date     │
├───────────────────────────┼──────────────────────┼────────────┼──────────┤
│ org.nuget.system.memory   │ 4.5.3                │            │          │
└───────────────────────────┴──────────────────────┴────────────┴──────────┘
```

### UPM and Git Url

Since Unity 2019.3, developers can install the UPM package directly via Git URL. It's a quick way to install packages, however
- lacking version control.
- lacking support for the custom package with Git dependencies. Git URL is not the standard syntax of package dependency, hence you cannot resolve a custom package that depends on another custom package using Git URLs.

To overcome these barriers, [UpmGitExtension](https://github.com/mob-sakai/UpmGitExtension) is a 3rd-party plugin that providing the Git tag based version control and the [dependency resolver](https://github.com/mob-sakai/GitDependencyResolverForUnity) for Git URLs. Along with [awesome-upm](https://github.com/starikcetin/awesome-upm) - a curated list of UPM repositories, together they offering a similar experience with OpenUPM. While the OpenUPM platform is still a better package discovery service.

## The Power of Open Source

OpenUPM is an open-source service. It's impossible to make it work without these amazing projects and services.

- [Verdaccio](https://verdaccio.org/) for the package registry
- [Vuepress](https://vuepress.vuejs.org/) for writing docs
- [Spectre](https://github.com/picturepan2/spectre) for styling
- [Digital Ocean](https://m.do.co/c/50e7f9860fa9) for the cloud computing
- [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/) for build pipelines
- [Netlify](https://github.com/netlify) for hosting the website
- [GitHub Actions](https://github.com/features/actions) for CI
