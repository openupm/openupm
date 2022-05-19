---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# Getting Started with OpenUPM-CLI

The article is a step-by-step tutorial for how to install openupm-cli and manipulate the package manifest file in the terminal. It can work with various shells:
- Bash for Mac/Linux
- [Git-Bash](https://gitforwindows.org/), CMD, or PowerShell for Windows.

::: tip Not a fan of command-line tool?
If you are unfamiliar with the command-line, you can still use other installation options available on the package page.
:::

## Installing OpenUPM-CLI

OpenUPM-CLI requires [Node.js 14.18 or above](https://nodejs.org/en/download/).


Let's verify the Node.js installation by printing the npm version (the node package manager where UPM is inspired from).

```sh
$ npm -v
6.13.4
```

It is recommended to install the openupm-cli globally, so you can use it from any path.

```sh
$ npm install -g openupm-cli
C:\Users\openupm\AppData\Roaming\npm\openupm -> C:\Users\openupm\AppData\Roaming\npm\node_modules\openupm-cli\bin\openupm + openupm-cli@1.1.0
updated 2 packages in 12.177s
```

Let's verify the openupm-cli installation by printing the version.

```sh
$ openupm --version
1.1.0
```

## Installing a UPM Package

The next step is creating a new Unity project, located at path `~/Document/projects/hello-openupm`.

Let's install [Unity Addressable Importer](https://github.com/favoyang/unity-addressable-importer) a helper package to manage addressable assets. First you need identify the package name.

```sh
# go to the unity project folder
$ cd ~/Document/projects/hello-openupm

# search package by keyword
$ openupm search addressable
fast search endpoint is not available, using old search.
┌───────────────────────────────────────┬─────────┬───────────┬────────────┐
│ Name                                  │ Version │ Author    │ Date       │
├───────────────────────────────────────┼─────────┼───────────┼────────────┤
│ com.littlebigfun.addressable-importer │ 0.4.1   │ Favo Yang │ 2019-12-10 │
│ Unity Addressable Importer            │         │           │            │
└───────────────────────────────────────┴─────────┴───────────┴────────────┘
```

It returns the package name `com.littlebigfun.addressable-importer`.

::: tip
You can directly copy the *install command* from the [package detail page](/packages/com.littlebigfun.addressable-importer) of the openupm website.
:::

Let's install the package via the `add` command.

```sh
$ openupm add com.littlebigfun.addressable-importer
added: com.littlebigfun.addressable-importer@0.4.1
manifest updated, please open unity project to apply changes
```

It returns that the package version 0.4.1 was added to the manifest file.

Go back to Unity editor, wait for the package manager to resolve package changes. Then you shall see the `com.littlebigfun.addressable-importer` appears in the package manager window.

![Install package](./images/getting-started-install-package.png)

Notice that the dependency `Addressbles` is also installed, but not shown in the `In Project` list. Because it's not the direct dependency of the project yet. If you want to use the latest version, you shall find it in the `All packages` list to upgrade the version. Or you can use openupm-cli to install the latest version.

```sh
$ openupm add com.unity.addressables
added: com.unity.addressables@1.5.0
manifest updated, please open unity project to apply changes
```
Go back to the Unity editor, wait for the package manager to resolve package changes. Then you shall see the latest version of `Addressables` appears in the package manager window.

![Upgrade package](./images/getting-started-upgrade-package.png)

::: warning Notice
As of December 2019, the openupm-cli only resolves package dependencies, to add necessary dependencies and scope information to the manifest file. It won't directly download the tarballs.
:::

## Understanding Manifest Changes

To understand the underlying changes of the manifest file, let's print the JSON content.

```json
$ cat Packages/manifest.json
{
  "dependencies": {
    ...
    "com.littlebigfun.addressable-importer": "0.4.1",
    "com.unity.addressables": "1.5.0"
  },
  "scopedRegistries": [
    {
      "name": "package.openupm.com",
      "url": "https://package.openupm.com",
      "scopes": [
        "com.littlebigfun.addressable-importer",
        "com.openupm"
      ]
    }
  ]
}
```

The openupm-cli adds both `com.littlebigfun.addressable-importer` and `com.unity.addressables` to dependencies. It also modified the scopedRegistries to link the `com.littlebigfun.addressable-importer` namespace with the openupm registry.

Please visit the [openupm-cli readme](https://github.com/openupm/openupm-cli#openupm-cli) for more usages.