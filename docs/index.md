---
ads: true
layout: Home
pageClass: homepage
title: Open Source Unity Package Registry (UPM)
heroText: Open Source Unity Package Registry
actionText: Guide
actionLink: /docs/
features:
- title: UPM Registry for Open Source Packages
  details: Hosting over ... open source packages, carefully selected by the community.
- title: Automated Package Publishing
  details: Tracking Git tags to automate the publishing process and ensure packages are always up-to-date.
- title: Command-Line Interface
  details: Optional <a href="https://github.com/openupm/openupm-cli">OpenUPM-CLI</a> tool for managing packages and interacting with 3rd-party UPM registries.
noGlobalSocialShare: true
---

### Get Started with CLI (Optional)

```sh
# Install openupm-cli
$ npm install -g openupm-cli
# OR yarn global add openupm-cli

# Enter your Unity project folder
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

::: warning DISCLAIMER
OpenUPM is an independent, open-source service and is not affiliated with Unity Technologies Inc.
:::

<style lang="stylus">
</style>
