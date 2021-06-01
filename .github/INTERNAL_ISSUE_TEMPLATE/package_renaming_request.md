---
name: Package renaming request
---
Hi @{{ pkg.owner }},

Favo from [OpenUPM](https://openupm.com) - a platform collects open-source UPM packages. First of all, thanks for creating this awesome open-source package. I am writing to you because OpenUPM is preparing to comply with [Unity's Terms of Services (TOS) Updates](https://forum.unity.com/threads/updates-to-our-terms-of-service-and-new-package-guidelines.999940/). Your package is available on [our platform](https://openupm.com/packages/{{ name }}), and I need your help to make some changes.

According to the [Unity Package Manager Naming Convention](https://docs.unity3d.com/Manual/cus-naming.html), the package name should use [reverse domain name notation](https://en.wikipedia.org/wiki/Reverse_domain_name_notation), at least 3 sections joined by a dot: `tld.org-name.package-name`. For example `com.littlebigfun.addressable-importer`.

- `tld` is the top-level domain, like `com`, `org` and so on. If you're not sure about what to use, please use `com`.
- `org-name` is your organization name. With `tld` together it makes sure the organization name is globally unique to its registered owner. You should avoid using a `tld` and `org-name` combination that may be confusing to users, like `com.unity` or `com.github`.
- `package-name` is your package name.

Your package name is `{{ name }}`. I recommend you to update it to comply with the naming convention by,

- change the package name in `package.json`.
- bump the version field of `package.json`.
- create a Git tag.

Please reply to me if you've made the change, I will update the OpenUPM side to make it live.

If you do not respond to the issue, It will be closed by the end of Jan 2021, and your package will be removed from our platform. Please notice that [Unity Package Guiding Principles & Guidelines](https://unity3d.com/legal/terms-of-service/software/package-guidelines?_ga=2.174090848.352038848.1608999010-134253320.1574534508) do not apply to you when you host Packages on GitHub for Unity users to download and put the Packages in their projects, as long as the hosted Package does not, directly or indirectly, leverage the Unity Editor as a marketing or distribution platform. Thus, you don't have to change anything if you don't intend to publish the package on a scoped registry (like OpenUPM).

Sorry for the inconvenience, feel free to discuss with me if you have any questions.

BR
Favo
