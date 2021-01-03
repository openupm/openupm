---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# Modifying UPM Package

## Modifying a Package Meta File

To update a package meta file (the YAML file), locate the file at the [data/packages](https://github.com/openupm/openupm/tree/master/data/packages) folder. Or use the "Edit this package" link at the end of the package README package. Then edit the content and create a pull request. Your PR will get merged after reviewing.

## Adding New Topics

To propose a new topic, please modify the [topics file](https://github.com/openupm/openupm/blob/master/data/topics.yml) and start a pull request.

## Modifying or Deleting a Published Version

Modifying or deleting a published version is considered a bad practice, since it may be already used by other developers. The rule is the same for other public registries like NPMJS. You can not unpublish published content. You can not even unpublish a package entirely after a period. If the intention is to fix bugs, we recommend you bump the version with a new Git tag.

If you do have a good reason to do that, please delete the related Git tag (or replace it with a new Git tag), then [create an issue](https://github.com/openupm/openupm/issues/new?title=Unpublish%20package%20version&template=unpublish_version.md) for unpublishing a version.

If you deleted or replaced published Git tags on your GitHub repository without notifying us, the changes will not affect content already published on the OpenUPM.

## Unpublishing a Package

In most cases, unpublishing a package means the package won't be listed under the website, but published versions remain on the registry to allow existing users to continue to visit the content. To achieve this, please start a pull request to
- Remove the package meta file at the [data/packages](https://github.com/openupm/openupm/tree/master/data/packages) folder.
- Add the package scope to the [data/blocked-scopes.yml](https://github.com/openupm/openupm/tree/master/data/blocked-scopes.yml) file to avoid re-submitting. Alternatively, add `"private": true"` to the package.json.

However, if you have a good reason like a legal issue, we will help you to remove all published versions entirely. Please [create an issue](https://github.com/openupm/openupm/issues/new?title=Unpublish%20package&template=unpublish_package.md) for unpublishing a package entirely.
