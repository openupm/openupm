---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# Introduction

OpenUPM is a service for hosting and building open-source UPM (Unity Package Manager) packages. OpenUPM provides a managed UPM registry and automatic build pipelines. The intention is to create a universal platform to discover, share, and distribute open-source UPM packages.

::: warning DISCLAIMER
OpenUPM is an open-source service, not an official service provided by Unity Technologies Inc.
:::

## How It Works

### Scope Registry and Command-Line Interface

Unity supports the [scoped registry](https://docs.unity3d.com/Manual/upm-scoped.html) that allowing developers to setup 3rd-party registries to host custom packages. OpenUPM provides a public UPM registry at `https://package.openupm.com`, and a group of services and tools to support it.

The downside of the scoped registry is that you need to [maintain the scope field](https://docs.unity3d.com/Manual/upm-manifestPrj.html) of the `manifest.json` file to make it work. It's not a problem when working with a single namespace. But it's a challenge to manage a public registry with various namespaces. The dependency chain makes the issue worse. For example, the package-a depends on b, and b depends on c. It's a headache for a human to resolve all these dependencies to fill the scope field manually.

To remove the pain to install a 3rd-party UPM package, we create a command-line tool [openupm-cli](https://github.com/openupm/openupm-cli) to maintain the project manifest file. It can add, remove, and search packages in a terminal app, like Bash, or Git-Bash, CMD, and PowerShell. When Unity detects the change of the manifest file, it will resolve it and install or remove packages for you. If you are unfamiliar with the command-line, you can still use other installation options available on the package detail page.

```
+-----+   update   +---------------+   resolve   +-----+
| CLI | ---------> | manifest.json | <---------- | UPM |
+-----+            +---------------+             +-----+
```

An quick example to use the command-line tool.

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

For the seamlessly Unity editor integration, please follow [#10](https://github.com/openupm/openupm/issues/10).

### Automatic Build Pipelines

OpenUPM maintains a [curated list](https://github.com/openupm/openupm/tree/master/data/packages) of open source UPM repositories hosting on GitHub. The build pipelines monitoring the list, detecting valid Git tags and publishing new package releases. The continuous publishing approach is different with the traditional package registry that requires the package owner/maintainer to submit publish releases manually. Though the CI tool delivers a similar continuous publishing experience, while the way OpenUPM works enabling not only packager owners/maintainers, but any developers with a GitHub account to contribute new UPM packages to the platform. The later role is called the [package hunter](/contributors/) to help the platform grow faster.

## Regions

For users who need to use OpenUPM services in China mainland, we suggest you switch to the [China region](https://openupm.cn), which provided the localized website and a mirror registry server at `https://package.openupm.cn`. The mirror registry synced with the global region every hour.

## Why Not ...?

### Unity Asset Store

[Unity Asset Store](https://assetstore.unity.com/) is the official solution for publishing software, assets, and services, offering both paid and free content. However, assets are installed into the Asset folder. The old fashion way is good for managing assets, but it lacks dependency management for libraries. Unity has a progressive way to encourage its large content to convert to the UPM format. But it takes time.

Unlike the Unity asset store, OpenUPM is focusing on the open-source from day one, and our open-source community is growing fast. Both the Unity Asset Store and OpenUPM will continue growing and inspiring each other.

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

To overcome these barriers, [UpmGitExtension](https://github.com/mob-sakai/UpmGitExtension) is a 3rd-party plugin that providing the Git tag based version control and the [dependency resolver](https://github.com/mob-sakai/GitDependencyResolverForUnity) for Git URLs. Along with [awesome-upm](https://github.com/starikcetin/awesome-upm) - a curated list of UPM repositories, together they offering a similar experience with OpenUPM. While the OpenUPM platform may be a better package discovery service.

## The Power of Open Source

OpenUPM is an open-source service. It's impossible to make it work without these amazing projects and services.

Open-source software

- [Verdaccio](https://verdaccio.org/) for the package registry.
- [Vuepress](https://vuepress.vuejs.org/) for writing docs.
- [Spectre](https://github.com/picturepan2/spectre) for styling.
- [Font Awesome](https://fontawesome.com/license/free) for icon.

Open-source friendly services

- [Digital Ocean](https://m.do.co/c/50e7f9860fa9) for the cloud computing.
- [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/) for build pipelines.
- [Netlify](https://github.com/netlify) for hosting the website (region US).
- [JDCloud](https://www.jdcloud.com/) for hosting the website (region CN).
- [GitHub Actions](https://github.com/features/actions) for CI.