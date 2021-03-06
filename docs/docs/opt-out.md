---
sidebar: true
sidebarDepth: 2
showFooter: false
---
# Opt-out From OpenUPM

OpenUPM respects the package owner's decision to opt-out from it, even an open-source license always grants the right to publish/distribute codes.

## Using Blocked Scopes

To block a scope (`com.mycompany`) entirely from OpenUPM, add the package scope or the package name to [data/blocked-scopes.yml](https://github.com/openupm/openupm/tree/master/data/blocked-scopes.yml) file and submit a PR with the reason. This blocking behavior happens on the CI stage, thus it will break any existing packages under the new-added blocked scope.

## Using the private field of the package.json

To opt-out from OpenUPM, the package owner can also add `"private": true"` to the package.json.

## Unpublishing a Package

Please checkout [Unpublishing a Package](./modifying-upm-package.md#unpublishing-a-package).

## Repository Unavailable

OpenUPM won't be able to track further changes if the repository is removed or turned private. However, the published content will remain available on the registry.
