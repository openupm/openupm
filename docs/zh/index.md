---
ads: true
layout: Home
pageClass: homepage
title:  OpenUPM - Unity开源软件包仓库
heroText: Unity开源软件包仓库
actionText: 使用指南
actionLink: /zh/docs/
features:
- title: 开源 UPM 软件包仓库
  details: 托管超过 ... 个由社区精心筛选的开源软件包。
- title: 自动化包发布
  details: 使用 Git 标签跟踪自动化发布过程，保持软件包更新。
- title: 命令行界面
  details: 可选用 <a href="https://github.com/openupm/openupm-cli">OpenUPM-CLI</a> 工具管理软件包并与第三方 UPM 软件包仓库交互。
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
OpenUPM 是一个独立的开源服务，与 Unity Technologies Inc. 没有关联。
:::

<style lang="stylus">
</style>
