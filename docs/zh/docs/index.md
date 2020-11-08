---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# 介绍

OpenUPM是一项用于托管和构建开源UPM（Unity软件包管理器）软件包的服务。它由两部分组成：托管的UPM软件包仓库和自动构建管线。我们的初衷是创建一个统一的平台来发现，共享和分发开源的UPM软件包，以及围绕此构建一个开源社区。

::: warning 免责声明
OpenUPM不是Unity Technologies Inc.提供的一项服务。
:::

## 运作原理

### 作用域软件包仓库和命令行工具

Unity支持[作用域软件包仓库（Scope Registry）](https://docs.unity3d.com/Manual/upm-scoped.html)，该功能允许开发人员设置第三方的软件包仓库来托管自定义软件包。 OpenUPM在`https://package.openupm.com`中提供了一个开放的UPM软件包仓库，以及一组支持它的服务和工具。

然而，作用域软件包仓库的缺点是你需要维护[软件包描述文件的scope字段](https://docs.unity3d.com/Manual/upm-manifestPrj.html)使其起作用。当使用单个作用域时(com.yourcompany)，这不是问题，但是这对使用来自第三方的各色命名的软件包来说，如何便捷的编辑该字段确实是一个挑战。而第三方软件包通常含有依赖包，使问题变得更糟。例如软件包a依赖于软件包b，而软件包b依赖于软件包c。安装软件包a时，所有的三个名称空间都应添加到`scope`字段。

为了解决这个问题，我们开发了命令行工具[openupm-cli](https://github.com/openupm/openupm-cli)用于帮助你编辑该字段。你可以在命令行终端中添加，删除，搜索，查看软件包。例如，使用Bash，Git-Bash，CMD或PowerShell。

```
+-----+   update   +---------------+   resolve   +-----+
| CLI | ---------> | manifest.json | <---------- | UPM |
+-----+            +---------------+             +-----+
```

::: tip 提示
如果你不习惯使用命令行工具，你仍然可以使用软件包页面提供的其他安装方式。
:::

```sh
# 安装openupm-cli
$ npm install -g openupm-cli
# 或者 yarn global add openupm-cli

# 输入Unity项目文件夹
$ cd YOUR_UNITY_PROJECT_FOLDER

# 搜索软件包
$ openupm search addressable-importer
┌───────────────────────────────────────┬─────────┬───────────┬────────────┐
│ Name                                  │ Version │ Author    │ Date       │
├───────────────────────────────────────┼─────────┼───────────┼────────────┤
│ com.littlebigfun.addressable-importer │ 0.4.1   │ Favo Yang │ 2019-11-25 │
│ Unity Addressable Importer            │         │           │            │
└───────────────────────────────────────┴─────────┴───────────┴────────────┘

# 安装软件包
$ openupm add com.littlebigfun.addressable-importer
added: com.littlebigfun.addressable-importer@0.4.1
manifest updated, please open unity project to apply changes
```

请访问[openupm-cli自述文件](https://github.com/openupm/openupm-cli#openupm-cli)了解更多用法。

更友好的编辑器集成可能会于2021年实现，请参阅[#10](https://github.com/openupm/openupm/issues/10).

### 自动构建管线

所有托管在OpenUPM上的开源UPM软件包，都会记录在GitHub的[软件包列表](https://github.com/openupm/openupm/tree/master/data/packages)文件中。构建管线定期查看该列表，检测到含有有效版本信息的Git标签后，处理并发布新的软件包版本。如果你使用NPM，会发现我们的做法与其不同。传统的软件包仓库要求软件包作者/维护者手动提交发布版本。尽管CI工具提供了类似的连续集成体验，但是OpenUPM构建管线工作方式不仅使该软件的作者，而且使所有拥有GitHub帐户的开发人员，都可以向OpenUPM平台贡献新的UPM软件包。后面的角色称为[软件包猎人](/contributors/)，以帮助平台更快地成长。

## 为什么不选择...？

### Unity资源商店

[Unity资源商店](https://assetstore.unity.com/) 是Unity推荐的发布软件，资源和服务的官方解决方案。它同时提供付费和免费内容。从Unity 2019.3开始，开发人员可以直接从软件包管理器窗口下载已安装的资源。但是，资源依旧被安装到Asset文件夹中，这是传统的管理资源的方法。该方法缺少依赖关系管理使其在管理软件类资源是稍显不足。Unity会逐步推出让资源商店完全支持UPM软件包，但这是一个渐进的过程。

与Unity资源商店不同，从一开始OpenUPM就专注于开源UPM软件包。我们认为开源的Unity社区目前还不是很强大，但是发展很快，最终将在Unity开发中发挥重要作用。我们认为在很长一段时间里Unity资源商店和OpenUPM都将同步发展，彼此促进。就如同商业软件和开源软件一样，协同发展。

### 其他第三方软件仓库

其他第三方软件仓库，例如[xcrew.dev](https://xcrew.dev/)，[upm-packages.dev](https://upm-packages.dev/)和[unitynuget-registry](https://unitynuget-registry.azurewebsites.net)同样提供了有价值的内容。通常由一些热情的开发人员进行维护。

如果这些UPM软件包的是托管在GitHub上，那么也可以贡献给OpenUPM平台。

事实上，当指定[registry选项](https://github.com/openupm/openupm/openupm-cli#command-options)后，openupm-cli可以支持任何第三方软件包仓库。例如，我们可以在尝试搜索`unitynuget-registry`软件包仓库中的`memory`关键词。

```sh
$ openupm search memory --registry=https://unitynuget-registry.azurewebsites.net
┌───────────────────────────┬──────────────────────┬────────────┬──────────┐
│ Name                      │ Version              │ Author     │ Date     │
├───────────────────────────┼──────────────────────┼────────────┼──────────┤
│ org.nuget.system.memory   │ 4.5.3                │            │          │
└───────────────────────────┴──────────────────────┴────────────┴──────────┘
```

### UPM和Git地址

从Unity 2019.3开始，开发人员可以直接通过Git地址安装UPM软件包。这是安装软件包的另一种快速方法，但是
- 缺乏版本控制。
- 缺少对包含Git依赖软件包的良好支持。Git地址不是软件包依赖关系的标准语法，因此你无法使用Git地址来解析并安装依赖包。

为了克服这些障碍，[UpmGitExtension](https://github.com/mob-sakai/UpmGitExtension)是一个第三方插件，提供基于Git标签的版本控制和[依赖解析](https://github.com/mob-sakai/GitDependencyResolverForUnity)。连同[awesome-upm](https://github.com/starikcetin/awesome-upm)，一个更松散的精选UPM软件列表，它们组合在一起，提供了类似于OpenUPM的体验。相较之下OpenUPM网站的发现服务可能更好。

## 开源的力量

OpenUPM是一种开源服务。没有下面这些令人赞叹的开源项目和对开源项目友好的服务，就不可能使其正常运行。

开源软件

- [Verdaccio](https://verdaccio.org/)用于软件包仓库。
- [Vuepress](https://vuepress.vuejs.org/)用于撰写文档。
- [Spectre](https://github.com/picturepan2/spectre)用于样式表。
- [Font Awesome](https://fontawesome.com/license/free)用于图标。

对开源项目友好的服务

- [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/) 用于构建管线。
- [GitHub Actions](https://github.com/features/actions) 用于连续集成。
- [Netlify](https://github.com/netlify) 用于托管国际区网站。
- [Digital Ocean](https://m.do.co/c/50e7f9860fa9) 用于托管国际区服务。
- [JDCloud](https://www.jdcloud.com/) 用于托管中国区服务。
