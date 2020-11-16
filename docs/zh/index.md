---
ads: true
layout: Home
pageClass: homepage
title:  OpenUPM - Unity开源软件包仓库
heroText: Unity开源软件包仓库
actionText: 使用指南
actionLink: /zh/docs/
features:
- title: 开源软件包仓库
  details: 托管由社区精选的开源UPM软件包
- title: 持续发布
  details: 基于Git标签的持续集成方案
- title: 命令行接口
  details: <a href="https://github.com/openupm/openupm-cli/blob/master/README.zh-cn.md#openupm-cli">OpenUPM-CLI 命令行工具</a>可支持第三方UPM软件源
noGlobalSocialShare: true
---

### 命令行工具入门（可选的）

```sh
# 从NPM安装 openupm-cli
$ npm install -g openupm-cli
# 或者使用Yarn
$ yarn global add openupm-cli

# 进入Unity工程目录
$ cd YOUR_UNITY_PROJECT_FOLDER

# 搜索软件包
$ openupm-cn search addressable-importer
┌───────────────────────────────────────┬─────────┬───────────┬────────────┐
│ Name                                  │ Version │ Author    │ Date       │
├───────────────────────────────────────┼─────────┼───────────┼────────────┤
│ com.littlebigfun.addressable-importer │ 0.4.1   │ Favo Yang │ 2019-11-25 │
│ Unity Addressable Importer            │         │           │            │
└───────────────────────────────────────┴─────────┴───────────┴────────────┘

# 安装软件包
$ openupm-cn add com.littlebigfun.addressable-importer
added: com.littlebigfun.addressable-importer@0.4.1
manifest updated, please open unity project to apply changes
```

::: warning 免责声明
OpenUPM是一项开源服务，而不是Unity Technologies优美缔软件提供的一项服务。
:::

<style lang="stylus">
</style>
