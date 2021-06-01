---
sidebar: true
sidebarDepth: 2
showFooter: false
pageClass: page-nuget
---
# NuGet Packages

::: warning Experiments
The UnityNuGet uplink is an experimental feature.
:::

[NuGet](https://docs.microsoft.com/en-us/nuget/what-is-nuget) is the package manager for .NET, designed to enable developers to share fundamental reusable code. Many UPM packages use NuGet packages as embed DLLs. The practice gets troubled when two packages included the same DLL or different versions of one NuGet package. The solution is to create a shared NuGet package that everyone can depend on.

Thanks to xoofx's [UnityNuGet](https://github.com/xoofx/UnityNuGet) which is a project that provides a service to bundle NuGet packages into the UPM format. Similar to OpenUPM, UnityNuGet maintains a [curated list](https://github.com/xoofx/UnityNuGet/blob/master/registry.json) of NuGet packages. All packages list there should be available on a registry at [https://unitynuget-registry.azurewebsites.net](https://unitynuget-registry.azurewebsites.net). The NuGet Registry takes care of packaging up these NuGet packages in a consistent, automated way, uses proper package naming under the `org.nuget` scope.

OpenUPM registry [uplinks](https://verdaccio.org/docs/en/uplinks) to UnityNuGet registry to make it easier to use a NuGet package.

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

See the demo project at [https://github.com/favoyang/com.example.nuget-consumer](https://github.com/favoyang/com.example.nuget-consumer) that including,

- Install an OpenUPM package that depends on UnityNuGet.
- Solve the potential assembly conflicting by disabling the "Assembly Version Validation".

## Using UnityNuGet Directly

Put UnityNuGet registry with scopes `org.nuget` as the first element of the scoped registries.

```json
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

## List all UnityNuGet Packages

Checkout the [curated list](https://github.com/xoofx/UnityNuGet/blob/master/registry.json).

Or use the [`/-/all` API endpoint](https://unitynuget-registry.azurewebsites.net/-/all)

```sh
$ curl -s https://unitynuget-registry.azurewebsites.net/-/all|json -k
```
