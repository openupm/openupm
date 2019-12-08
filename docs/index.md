---
layout: Home
title: Open Source Unity Package Registry
heroText: Open Source Unity Package Registry
actionText: Get Started
actionLink: /guide/
features:
- title: Open Source UPM Registry
  details: Hosting community selective open source UPM packages and keep growing
- title: Continuous Publishing
  details: Package publishing automation based on git tags
- title: Command Line
  details: The <a href="https://github.com/openupm/openupm-cli">openupm-cli</a> works with both official and 3rd-party registries
---

### Get Started

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

::: warning COMPATIBILITY NOTE
openupm-cli tested with [Node.js 12](https://nodejs.org/en/)

:::