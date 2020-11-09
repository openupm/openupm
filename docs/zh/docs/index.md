---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# 介绍

OpenUPM是一项用于托管和构建开源UPM软件包的服务。UPM是“Unity软件包管理器”的缩写。OpenUPM由两部分组成：可托管的UPM软件包仓库和与之配合的自动构建管线。我们的初衷是创建一个统一的平台，来发现、共享和分发开源的UPM软件包，以及围绕此构建一个开源社区。

::: warning 免责声明
OpenUPM是一项开源服务，而不是Unity Technologies优美缔软件提供的一项服务。
:::

## 运作原理

### 作用域软件包仓库和命令行工具

Unity支持[作用域软件包仓库（Scope Registry）](https://docs.unity3d.com/Manual/upm-scoped.html)，该功能允许开发人员设置第三方的软件包仓库来托管自制的软件包。 OpenUPM提供了一个开放的UPM软件包仓库（地址：`https://package.openupm.com`），以及一组支持它的服务和工具。

尽管作用域软件包让重用软件变得便捷，但它的缺点是需要用户手动维护[软件包描述文件的scope字段](https://docs.unity3d.com/Manual/upm-manifestPrj.html)。公司的内部软件，通常使用单个作用域，比如`com.yourcompany`，这通常就够用了。但是这对使用来自第三方的各色命名的软件包来说，如何便捷的维护该字段确实是一个挑战。而第三方软件包通常含有依赖包，使问题变得更糟。例如软件包`com.team1.A`依赖于软件包`com.team2.B`，而软件包`com.team2.B`依赖于软件包`com.team3.B`。安装软件包`com.team1.A`时，所有的三个作用域`com.team1, com.team2, com.team3`都应添加到`scope`字段。这本就比较繁琐，而用户怎么能在安装一个新的软件包之前，就知晓所有的依赖关系呢？这是包管理器的工作，而不是用户的工作。

为了解决这个问题，OpenUPM开发了命令行工具[OpenUPM-CLI](https://github.com/openupm/openupm-cli)用于帮助你自动的维护`scope`字段。你可以在命令行终端中添加，删除，搜索，查看软件包。例如，使用Bash，Git-Bash，CMD或PowerShell。

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

请访问[OpenUPM-CLI自述文件](https://github.com/openupm/openupm-cli#openupm-cli)，了解更多用法。

关于更友好的Unity编辑器集成，请参考工单[#10](https://github.com/openupm/openupm/issues/10).

### 自动构建管线

所有托管在OpenUPM上的开源UPM软件包，都会记录在GitHub的一个[软件包列表](https://github.com/openupm/openupm/tree/master/data/packages)文件中。构建管线定期查看该列表。当检测到含有有效版本信息的Git标签后，它会处理并发布新的软件包版本。如果你熟悉NPM的工作方式，会发现我们的做法与其不同。传统的软件包仓库要求软件包作者手动地提交并发布版本。而OpenUPM的构建管线自动化了这一过程。并使得拥有GitHub帐户的一般开发人员，都可以向OpenUPM平台贡献新的UPM软件包。我们称这一角色称为[软件包猎人](/contributors/)。热心的软件包猎人正是OpenUPM平台发展的重要助力。

## OpenUPM国际区和OpenUPM中文网的关系

OpenUPM分为国际区和中国区。OpenUPM中文网提供了在中国本地化的服务，包括文档的本地化和在中国托管的软件仓库映像。中国区的软件仓库，每小时同国际区同步一次。这样保证了中国区可以方便的访问到最新的软件包，并符合中国法律的要求。

如果你对中国区的发展有任何的建议和诉求，请联系[hello@openupm.com](mailto:hello@openupm.com)。

## 为什么不选择...？

### Unity资源商店

[Unity资源商店](https://assetstore.unity.com/) 是Unity官方推荐的发布软件、资源和服务的解决方案。它同时提供付费和免费内容。从Unity 2019.3开始，开发人员可以直接从软件包管理器窗口下载到已安装的资源。但是，通过Unity资源商店购买的资源，依旧被安装到Asset文件夹中。这是上一代的管理资源的方法，缺少依赖关系管理，也不能方便的移除软件包。使其在管理软件类资源时稍显不足。Unity会逐步推出让资源商店完全支持UPM软件包的解决方案，但这将是一个渐进的过程。OpenUPM也愿意为该进程助力。

与Unity资源商店不同，从一开始OpenUPM就专注于开源的UPM软件包。开源是软件开发领域一股无法忽视的力量。开源的Unity社区目前还不是很强大，但是发展很快，最终将在Unity开发中发挥重要作用。我们认为在很长一段时间里Unity资源商店和OpenUPM都将同步发展，彼此促进。就如同商业软件和开源软件一样，协同发展。

### 其他第三方软件仓库

其他第三方软件仓库，例如[xcrew.dev](https://xcrew.dev/)，[upm-packages.dev](https://upm-packages.dev/)和[unitynuget-registry](https://unitynuget-registry.azurewebsites.net)同样提供了有价值的内容。通常由一些热情的开发人员进行维护。

如果这些UPM软件包是托管在GitHub上的，那么也可以直接贡献给OpenUPM平台。

事实上，当指定[registry选项](https://github.com/openupm/openupm/openupm-cli#command-options)后，openupm-cli可以支持任意的第三方软件包仓库。例如，我们可以尝试在`unitynuget-registry`软件包仓库中搜索`memory`关键词。

```sh
$ openupm search memory --registry=https://unitynuget-registry.azurewebsites.net
┌───────────────────────────┬──────────────────────┬────────────┬──────────┐
│ Name                      │ Version              │ Author     │ Date     │
├───────────────────────────┼──────────────────────┼────────────┼──────────┤
│ org.nuget.system.memory   │ 4.5.3                │            │          │
└───────────────────────────┴──────────────────────┴────────────┴──────────┘
```

### UPM和Git托管

从Unity 2019.3开始，开发人员可以直接通过Git地址安装UPM软件包。这是安装软件包的另一种快速方法。但是Git托管有两个明显的缺点：
- 缺乏版本控制。
- 缺少对Git依赖的支持。Git地址不是软件包依赖关系的标准语法，因此你无法使用Git地址来解析并安装依赖包。

为了克服这些障碍，[UpmGitExtension](https://github.com/mob-sakai/UpmGitExtension)是一个第三方插件，提供基于Git标签的版本控制和[依赖解析](https://github.com/mob-sakai/GitDependencyResolverForUnity)。连同[awesome-upm](https://github.com/starikcetin/awesome-upm)，一个更松散的精选UPM软件列表，它们组合在一起，提供了类似于OpenUPM的体验。我们认为这很棒。当然，OpenUPM网站的发现服务也许更方便些。

## 开源的力量

OpenUPM是一项开源服务。多亏了下面这些令人赞叹的开源项目和对开源项目友好的商业服务的支持：

开源软件

- [Verdaccio](https://verdaccio.org/)用于软件包仓库。
- [Vuepress](https://vuepress.vuejs.org/)用于撰写文档。
- [Spectre](https://github.com/picturepan2/spectre)用于样式表。
- [Font Awesome](https://fontawesome.com/license/free)用于图标。

对开源项目友好的商业服务

- [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/) 用于构建管线。
- [GitHub Actions](https://github.com/features/actions) 用于连续集成。
- [Netlify](https://github.com/netlify) 用于托管国际区网站。
- [Digital Ocean](https://m.do.co/c/50e7f9860fa9) 用于托管国际区服务。
- [京东智联云](https://www.jdcloud.com/) 用于托管中国区服务。
