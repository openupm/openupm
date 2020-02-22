---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# Adding UPM Package

## UPM Package Criteria

OpenUPM requires the package repository fulfils below criteria
- Valid UPM structure, contains at least the `package.json` file, can be placed at a sub-folder.
- Open source license. It is recommended to choose one from the [spdx license list](https://spdx.org/licenses/).
- Hosting on Github.
- Git tags that are valid semver. i.e. `v1.1.0`, `1.1.0`, `1.1.1-preview`, `v2.0.0-preview.1`. Only valid tags are built. It is recommended to either use the [GitHub release](https://help.github.com/en/github/administering-a-repository/creating-releases) feature, or [CI tools](https://medium.com/openupm/how-to-maintain-upm-package-part-2-f352fbf5f87c) to create git tags.

## Understanding Different Folder Structures of UPM Repositories

There're three typical folder structures of UPM repositories. OpenUPM build pipelines can handle all of them.

- UPM package at the root path
- UPM package at a sub-folder
- UPM package at a sub-folder with UPM branch

### UPM Package at the Root Path

The `package.json` file is located at the root path of the master branch. It is the simplest case.

### UPM Package at a Sub-folder

The master branch is usually an Unity project (with Assets folder). The `package.json` file is located at a sub-folder, for example `Assets/package-name` or `Packages/com.namespace.package-name`. Git tags are based on the master branch. Build pipelines will detect the location of the `package.json` file, and handle it correctly.

### UPM Package at a Sub-folder with UPM Branch

The master branch is usually an Unity project (with Assets folder). The `package.json` file is located at a sub-folder, for example `Assets/package-name` or `Packages/com.namespace.package-name`. An `upm` branch is created from the package folder using the `git subtree split/push` command to make the `package.json` file placed at the root path. So the package can be installed by Unity Package Manager via git url. Git tags are based on the upm branch.

## Package YAML File

OpenUPM uses a yaml file to store the package information. Here's an example.

```yaml
# package name
name: com.namespace.unitypackageexample
# package display name
displayName: Unity Package Example
# package description
description: An unity package example
# repository url
repoUrl: 'https://github.com/author/reponame'
# forked repository url
parentRepoUrl: null
# spdx license id
licenseSpdxId: MIT
# license name
licenseName: MIT License
# list of topic slugs
topics:
  - library
# Filter git tags based on prefix. Used by monorepos to separate pacakges
gitTagPrefix: ''
# A regular expression to ignore git tags
gitTagIgnore: '-master$'
# featured image
image: 'https://github.com/author/reponame/raw/master/path-of-img.png'
# package hunter name (github username)
hunter: author
```

## Using Package Add Form

Package hunters can use the [package add form](/packages/add/), to submit the package yaml file. The form will guide you to fill required information, generate the yaml file, then submit to GitHub as pull request in the browser.

[![package add form](./images/package-add-form.png)](/packages/add/)

The pull request of adding new package will be merged automatically. The CI will do jobs to update the website and build pipelines. Within a few minutes you can view the package detail page at url `/packages/com.namespace.package-name`, and check the build result from the **version history** and **build issues** sections.

@flowstart
form=>operation: Fill the package form
pr=>operation: Start a pull request
ci=>operation: Wait the CI

form->pr
pr->ci
@flowend

## Troubleshooting

### Handling a Repository without Git Tag

Please create an issue on the author's repository for making GitHub releases. The git tag should be a valid semver. To learn how to automate the release process with GitHub actions, please checkout [this tutorial](https://medium.com/openupm/how-to-maintain-upm-package-part-2-f352fbf5f87c).

### Handling Duplicated Tags for master and upm Branches

A repository may contain duplicated version tags. Likely created by CI tools, one for the master branch, another for the upm branch. i.e

- `1.0.0` and `upm/1.1.0`
- `1.0.0` and `1.1.0-upm`
- `1.0.0-master` and `1.1.0-upm`

In such case the tag from the upm branch takes higher priority, another one is ignored.

### Handling Failed Builds

You can check the failed reason at the build issues section on the package detail page. The most common issue is *version conflict*, means a package with with the same version is already published. The package owner need bump the version with a new GitHub release, or re-tag the existing release. Build pipelines will re-build failed releases if detecting that the related git tag was removed or re-tagged.

However, build pipelines will not rebuild a already succeeded release if detecting that the git tag is removed or retagged. Because it's a bad practice for talking off or replacing an existing release for a public registry. If the intention is to fix something, the packager owner is recommended to bump the version with a new git tag. For the rare case, please [create an issue](https://github.com/openupm/openupm/issues) for unpublishing.

### Handling Monorepos

Monorepos preset multiple packages in a single repository. Usually layout as below,

```
Packages
  namespace.a
    package.json
  namespace.b
    package.json
```

For monorepos, multiple package submissions are required. You need submit packages one by one to the OpenUPM platform. Then there're two cases,
- If you make a single Github release for each new version, it will just works. Our build pipelines will treat each package submission separately, and locate the relevant package.json to process.
- If you make separate GitHub releases for each new version, you need use a git tag prefix for each package. i.e `namespace.a/1.0.0` and `namespace.b/1.0.0`. Then fill the `gitTagPrefix` field of the package YAML file. i.e package `namespace.a` should have `gitTagPrefix: "namespace.a/"`, to avoid wasting resources of build pipelines.
