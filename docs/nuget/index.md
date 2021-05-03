---
sidebar: true
sidebarDepth: 2
showFooter: false
pageClass: page-nuget
---
# NuGet Packages

[NuGet](https://docs.microsoft.com/en-us/nuget/what-is-nuget) is the package manager for .NET, designed to enable developers to share fundamental reusable code. Many UPM packages use NuGet packages as embed DLLs. The practice gets troubled when two packages included the same DLL or different versions of one NuGet package. The solution is to create a shared NuGet package that everyone can depend on.

Thanks to xoofx's [UnityNuGet](https://github.com/xoofx/UnityNuGet) which is a project that provides a service to bundle NuGet packages into the UPM format. Similar to OpenUPM, UnityNuGet maintains a [curated list](https://github.com/xoofx/UnityNuGet/blob/master/registry.json) of NuGet packages. All packages list there should be available on a registry at https://unitynuget-registry.azurewebsites.net. The NuGet Registry takes care of packaging up these NuGet packages in a consistent, automated way, uses proper package naming under the `org.nuget` scope.

OpenUPM registry uplinks to UnityNuGet registry to make it easier to use a NuGet package.

- OpenUPM registry sync with UnityNuGet registry hourly.
- Cached tarballs are hosting on CDN as well.
- You can view package detail via openupm-cli `openupm view org.nuget.some-package`.

The integration comes with a few limitations.

- NuGet packages are not searchable or browse-able on the OpenUPM website.
- Search for NuGet packages via OpenUPM registry's search endpoint will result in "404 packages not found". This affects both openupm-cli's search command and Untiy PackMan's search feature. As a side-effect of the issue,
  - NuGet packages will be invisible in Unity PackMan's "My Registries" section, but still visible on the "In Project" section.
  - Unity console will warn "Error searching for packages" the first time open the PackMan.
  - The search issue may be resolved with an improved search endpoint behavior in the future.

## Using Uplinked UnityNuGet

In the demo,

- `org.nuget.system.memory` is a NuGet package with some NuGet dependencies.
- `com.example.nuget-consumer` is an OpenUPM package that depends on `org.nuget.system.memory`.

Install `com.example.nuget-consumer` via openupm-cli

```sh
$ openupm install com.example.nuget-consumer
notice manifest added com.example.nuget-consumer@1.0.1
notice please open Unity project to apply changes
```

`Packages/manifest.json` changes:

```
  "scopedRegistries": [
    {
      "name": "package.openupm.com",
      "url": "https://package.openupm.com",
      "scopes": [
        "com.example.nuget-consumer",
        "org.nuget.system.buffers",
        "org.nuget.system.memory",
        "org.nuget.system.numerics.vectors",
        "org.nuget.system.runtime.compilerservices.unsafe"
      ]
    }
```

Notice that `org.nuget.system.memory` was added to scopes along with its dependencies, to help Unity finds all dependencies.

If Unity prompts

```
Assembly 'Packages/org.nuget.system.memory/System.Memory.dll' will not be loaded due to errors:
System.Memory references strong named System.Buffers Assembly references: 4.0.2.0 Found in project: 4.0.3.0.
Assembly Version Validation can be disabled in Player Settings "Assembly Version Validation"
```

Please follow the instruction to disable Player Settings' `Assembly Version Validation`.

## Using UnityNuGet Directly

Put UnityNuGet registry with scopes `org.nuget` as the first element of the scoped registries.

```
{
  "scopedRegistries": [
    {
      "name": "Unity NuGet",
      "url": "https://unitynuget-registry.azurewebsites.net",
      "scopes": [
        "org.nuget"
      ]
    }
    , ...
  ],
}
```
