---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# 修改UPM软件包

## 修改软件包元数据文件

软件包元数据文件（YAML文件）位于GitHub代码仓库的[data/packages](https://github.com/openupm/openupm/tree/master/data/packages)文件夹内。你也可以使用软件包网页末尾的“编辑此软件包”链接，快速定位该文件。请编辑该文件，并创建合并请求（PR）。你的请求将会在人工审核后被合并。

## 添加新的软件包主题

若提议新的软件包主题，请修改[软件包主题文件](https://github.com/openupm/openupm/blob/master/data/topics.yml)，并提交一个合并请求（PR）。

## 修改或删除已发布的版本

修改或删除已发布的版本一般是不妥的做法，因为其他开发人员可能已经在使用它了。该规则对于其他的公共软件包仓库也适用，例如NpmJS。你不能取消已发布的内容。一段时间后，你甚至无法整体移除该软件包。因此，如果要修复错误，我们建议你提升版本，并生成一个新的Git标签。

如果你确实有这样做的特殊理由，请删除相关的Git标签（或将其重新打标签），然后[创建一个工单](https://github.com/openupm/openupm/issues/new?title=Unpublish%20package%20version&template=unpublish_version.md)来申请删除一个已发行的版本。

如果你在未通知我们的情况下删除或替换了GitHub代码仓库上那些已经被OpenUPM处理过的Git标签，则你所做的更改将不会影响到已在OpenUPM软件仓库上发布的内容。

## 整体删除已发布软件包

在大多数情况下，取消发布软件包意味着该软件包不会在网站下显示，但已发布的UPM版本仍保留在软件仓库中，以方便现有用户继续访问内容。如果这是可以接受的话，请提交一个合并请求（PR）包含以下内容：
- 首先，在GitHub代码仓库的[data/packages](https://github.com/openupm/openupm/tree/master/data/packages)文件夹内找到并删除你指定的软件包原数据文件（YAML文件）。
- 然后，将软件包的名字添加到如下文件中，[data/blocked-scopes.yml](https://github.com/openupm/openupm/tree/master/data/blocked-scopes.yml) 来阻止软件包被再次提交。或者，添加`"private": true"`到`package.json`文件.

如果你有充分的理由（例如法律问题）必须要删除已发布的UPM版本，我们仍将协助你。 请[创建工单](https://github.com/openupm/openupm/issues/new?title=Unpublish%20package&template=unpublish_package.md) 来申请删除所有已发行的版本。

如果你在未通知我们的情况下删除整个代码仓库，你所做的更改将不会影响到已在OpenUPM软件仓库上发布的内容。
