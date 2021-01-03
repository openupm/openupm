---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# 声明不参与OpenUPM

我们尊重软件包所有者选择不参与OpenUPM的决定，即使开源代码许可证始终授予了第三方发布/分发代码的权利。

## 使用Blocked Scopes

要在OpenUPM阻止整个作用域scope（`com.mycompany`），请将scope或包名称添加到[data/blocked-scopes.yml](https://github.com/openupm/openupm/tree/master/data/blocked-scopes.yml)文件并提交PR。这种阻止行为发生在CI阶段，因此新添加的scope可能会包含并破坏已经发布的软件包名称。

## 使用package.json的private字段

软件包所有者还可以在package.json中添加`"private": true"`字段，来隐含声明不参与OpenUPM。

## 取消发布软件包

请查看[取消发布程序包](./modifying-upm-package.md#整体删除已发布软件包)。
