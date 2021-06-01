## [1.49.5](https://github.com/openupm/openupm/compare/1.49.4...1.49.5) (2021-05-16)


### Bug Fixes

* **data:** remove package names are not well-scoped (close [#1521](https://github.com/openupm/openupm/issues/1521)) ([c4f4072](https://github.com/openupm/openupm/commit/c4f407208fea9796f11e78d2b7c4b2b53e89a422))

## [1.49.4](https://github.com/openupm/openupm/compare/1.49.3...1.49.4) (2021-05-09)


### Bug Fixes

* **website:** add an extra warning for packages with com.unity or unity text (refs [#1755](https://github.com/openupm/openupm/issues/1755)). ([24a5079](https://github.com/openupm/openupm/commit/24a50793d157b377a3347c5111e331b9fe1069fa))
* **website:** add disabled code snippet to verify Unity registry on package submission form (refs [#1755](https://github.com/openupm/openupm/issues/1755)). ([3e17669](https://github.com/openupm/openupm/commit/3e17669ed24786ce0a8111f95905f46fdb0a9aa0))

## [1.49.3](https://github.com/openupm/openupm/compare/1.49.2...1.49.3) (2021-05-03)


### Bug Fixes

* **web:** no longer warns org.nuget.* dependency missing (refs [#1976](https://github.com/openupm/openupm/issues/1976)) ([27d75ed](https://github.com/openupm/openupm/commit/27d75ed52e0335f540835ee532b1350f556533ee))

## [1.49.2](https://github.com/openupm/openupm/compare/1.49.1...1.49.2) (2021-04-25)


### Bug Fixes

* **data:** remove firebase related packages that break Unity terms (close: [#2062](https://github.com/openupm/openupm/issues/2062)) ([3534a29](https://github.com/openupm/openupm/commit/3534a2923c88144697f95a3e49c8ec2abb4805bc))

## [1.49.1](https://github.com/openupm/openupm/compare/1.49.0...1.49.1) (2021-04-17)


### Bug Fixes

* **web:** add vuepress-plugin-chunkload-redirect to resolve the chunk load failure issue ([860bc43](https://github.com/openupm/openupm/commit/860bc431123e2572520cb1f1e549674565cf3d5f))

# [1.49.0](https://github.com/openupm/openupm/compare/1.48.4...1.49.0) (2021-03-06)


### Features

* handle repository unavailable ([c45c4ac](https://github.com/openupm/openupm/commit/c45c4ac0ef1775f7ed28661ef142af8161c52a69))

## [1.48.4](https://github.com/openupm/openupm/compare/1.48.3...1.48.4) (2021-03-06)


### Bug Fixes

* **pipelines:** handle error code RemoteRepositoryUnavailable ([1130bb8](https://github.com/openupm/openupm/commit/1130bb8481c0d82f245d3a54e5ac879ff50fd84d))

## [1.48.3](https://github.com/openupm/openupm/compare/1.48.2...1.48.3) (2021-02-03)


### Bug Fixes

* set license id to null since UDP isn't in Spdx ([1cd45da](https://github.com/openupm/openupm/commit/1cd45dac91b896b21760f9f6d8cc792a0b4a1914))

## [1.48.2](https://github.com/openupm/openupm/compare/1.48.1...1.48.2) (2021-01-29)


### Bug Fixes

* **website:** package add form should use the package info description then fallback to the repo description. (close: [#1851](https://github.com/openupm/openupm/issues/1851)) ([221baa3](https://github.com/openupm/openupm/commit/221baa3bc3ad02682c83211803f9e474e59b6aa4))

## [1.48.1](https://github.com/openupm/openupm/compare/1.48.0...1.48.1) (2021-01-10)


### Bug Fixes

* **pipelines:** handle error invalid version ([b873450](https://github.com/openupm/openupm/commit/b8734500cd5ca1ceb01a92447ba8a41827a837df))

# [1.48.0](https://github.com/openupm/openupm/compare/1.47.2...1.48.0) (2021-01-03)


### Features

* **pipelines:** refuse to submit a blocked or private repository (close: [#1762](https://github.com/openupm/openupm/issues/1762)) ([6897534](https://github.com/openupm/openupm/commit/689753420d76503484dec29b218d5148dd56f5db))

## [1.47.2](https://github.com/openupm/openupm/compare/1.47.1...1.47.2) (2020-12-27)


### Bug Fixes

* **pipelines:** handle remote branch not found error ([3f75b73](https://github.com/openupm/openupm/commit/3f75b733fb3df401a2ed4669252c44aafcf1807b))
* **pipelines:** remove unsued PackageNameNotMatch error code ([9dbb7fc](https://github.com/openupm/openupm/commit/9dbb7fcc1547a29cccaf9105cc6b4d3914b25d9d))

## [1.47.1](https://github.com/openupm/openupm/compare/1.47.0...1.47.1) (2020-12-14)


### Bug Fixes

* **pipelines:** handle E504 gateway timeout ([b18497e](https://github.com/openupm/openupm/commit/b18497ef55207ddd10c2ee5ac7d3d8ffddcd66f0))

# [1.47.0](https://github.com/openupm/openupm/compare/1.46.3...1.47.0) (2020-12-13)


### Features

* **website:** add status page (close [#1714](https://github.com/openupm/openupm/issues/1714)) ([9422c3d](https://github.com/openupm/openupm/commit/9422c3dd0037e6aa9fca524a8a9b8af5bd973051))

## [1.46.3](https://github.com/openupm/openupm/compare/1.46.2...1.46.3) (2020-12-07)


### Bug Fixes

* **website:** ensure that package names are well-scoped in package add form (refs [#1521](https://github.com/openupm/openupm/issues/1521)) ([814b740](https://github.com/openupm/openupm/commit/814b7403caa5a10839540660af532f277fed8f72))

## [1.46.2](https://github.com/openupm/openupm/compare/1.46.1...1.46.2) (2020-12-06)


### Bug Fixes

* **website:** loading error caused by sharing code ([ec13729](https://github.com/openupm/openupm/commit/ec137292162c67c3c5af15012d9a904678adafc5))

## [1.46.1](https://github.com/openupm/openupm/compare/1.46.0...1.46.1) (2020-12-06)


### Bug Fixes

* **pipelines:** add tests to ensure that package names are well-scoped (refs [#1521](https://github.com/openupm/openupm/issues/1521)) ([307ad23](https://github.com/openupm/openupm/commit/307ad23a790f9f98425e616e91c4952d35da607d))

# [1.46.0](https://github.com/openupm/openupm/compare/1.45.0...1.46.0) (2020-12-05)


### Features

* **website:** make package description searchable ([cb6d5d0](https://github.com/openupm/openupm/commit/cb6d5d00f94bbc6bca3ecec2be6bfd70125478cb))

# [1.45.0](https://github.com/openupm/openupm/compare/1.44.0...1.45.0) (2020-12-04)


### Features

* **pipelines:** handle error heap out of memory ([172bfad](https://github.com/openupm/openupm/commit/172bfad5b11a6cf4c15620b4a03cd06f2d6dc616))

# [1.44.0](https://github.com/openupm/openupm/compare/1.43.2...1.44.0) (2020-12-03)


### Features

* **website:** add the region sub-menu ([d8e7eab](https://github.com/openupm/openupm/commit/d8e7eabd45f47318694413711c2c52bb6e980353))

## [1.43.2](https://github.com/openupm/openupm/compare/1.43.1...1.43.2) (2020-11-29)


### Bug Fixes

* **website:** use internal installer endpoint for region cn ([6a7a91c](https://github.com/openupm/openupm/commit/6a7a91c5db2d0de957de87607c46bd87ebb15dd1))

## [1.43.1](https://github.com/openupm/openupm/compare/1.43.0...1.43.1) (2020-11-29)


### Bug Fixes

* **pipelines:** should validate the package yml file extention name in CI (close: [#1665](https://github.com/openupm/openupm/issues/1665)) [skip ci] ([89845ee](https://github.com/openupm/openupm/commit/89845ee10f6c5a375e382647158dcc9377fdf7c0))
* **website:** localized package detail page title for region CN (refs [#1581](https://github.com/openupm/openupm/issues/1581)) ([7cc8def](https://github.com/openupm/openupm/commit/7cc8def30ae3cb37aaa4e036994c6a8d7e7903d1))

# [1.43.0](https://github.com/openupm/openupm/compare/1.42.2...1.43.0) (2020-11-28)


### Features

* **website:** add Chinese related fields to the package add form (refs [#1581](https://github.com/openupm/openupm/issues/1581)) ([abfbb7a](https://github.com/openupm/openupm/commit/abfbb7a605e0613f81a7614dc56d2a906e51221b))
* **website:** add report abuse button (refs [#1581](https://github.com/openupm/openupm/issues/1581)) ([eb34b83](https://github.com/openupm/openupm/commit/eb34b831c0a744a2ed6a436bc3d36e4e47a73c02))
* **website:** serve Chinese readme (refs [#1581](https://github.com/openupm/openupm/issues/1581)) ([9eb1e1f](https://github.com/openupm/openupm/commit/9eb1e1f6faa6d3442ef25c8c773bd7e23bca1720))

## [1.42.2](https://github.com/openupm/openupm/compare/1.42.1...1.42.2) (2020-11-28)


### Bug Fixes

* **website:** show localized texts on the recently updated packages component. ([bd9ecb2](https://github.com/openupm/openupm/commit/bd9ecb2d12a9d0e7544996bd357f037cb644867a))

## [1.42.1](https://github.com/openupm/openupm/compare/1.42.0...1.42.1) (2020-11-25)


### Bug Fixes

* **i18n:** flexsearch option for region CN ([d8089d5](https://github.com/openupm/openupm/commit/d8089d58bf3a469127e1e643e2e2460071642acf))

# [1.42.0](https://github.com/openupm/openupm/compare/1.41.0...1.42.0) (2020-11-25)


### Features

* **website:** display localized package meta ([ec22032](https://github.com/openupm/openupm/commit/ec220325daa6f19246bd29f01607f818ccde3d0e))

# [1.41.0](https://github.com/openupm/openupm/compare/1.40.7...1.41.0) (2020-11-23)


### Bug Fixes

* **pipelines:** add fetch-backer-data job [skip ci] ([d6a5d84](https://github.com/openupm/openupm/commit/d6a5d84ebc876432fefc00cb75a092422705e614))
* **pipelines:** change aggregatePackageExtra health check id [skip ci] ([d0fef03](https://github.com/openupm/openupm/commit/d0fef0327b14d1b1eec10de4af588ac8d00ea4a9))


### Features

* **pipelines:** integrate with healthchecks.io [skip ci] ([61aeff1](https://github.com/openupm/openupm/commit/61aeff1dc32423ad450214766c83a3d40ac04510))

## [1.40.7](https://github.com/openupm/openupm/compare/1.40.6...1.40.7) (2020-11-22)


### Bug Fixes

* **website:** cache the avatar image ([b53c769](https://github.com/openupm/openupm/commit/b53c769c22a3699421336409bd488946423f4dc7))

## [1.40.6](https://github.com/openupm/openupm/compare/1.40.5...1.40.6) (2020-11-22)


### Bug Fixes

* **website:** update media base URL for region CN ([d0ab08f](https://github.com/openupm/openupm/commit/d0ab08f4fe0e40b5a1f608c6b4b2fe059661e32a))

## [1.40.5](https://github.com/openupm/openupm/compare/1.40.4...1.40.5) (2020-11-20)


### Bug Fixes

* **website:** smaller ad widget ([cfbf7d3](https://github.com/openupm/openupm/commit/cfbf7d32749020d4ebdc5c19ee094bd5f2bb5d6d))

## [1.40.4](https://github.com/openupm/openupm/compare/1.40.3...1.40.4) (2020-11-18)


### Bug Fixes

* **pipelines:** aggregate media extname should be png [skip ci] ([9cdf1a9](https://github.com/openupm/openupm/commit/9cdf1a9ca5d56f7b6ae293fcd28d9c22641a2d1b))
* **pipelines:** fix local media ACL [skip ci] ([6fa3160](https://github.com/openupm/openupm/commit/6fa3160613ea0e5a09227393a80eb432aa6bfca9))
* **pipelines:** set local media content type [skip ci] ([b029c40](https://github.com/openupm/openupm/commit/b029c402b9d48f2a0dd3b6b330afafe043569cff))
* **website:** use aggregate media ([fed266c](https://github.com/openupm/openupm/commit/fed266c762d1377de289dd03d6a912a4bd306c61))

## [1.40.3](https://github.com/openupm/openupm/compare/1.40.2...1.40.3) (2020-11-14)


### Bug Fixes

* tweak sponsor display ([5e759eb](https://github.com/openupm/openupm/commit/5e759eb8319dbd9c54234a1a3197d83821a434cd))

## [1.40.2](https://github.com/openupm/openupm/compare/1.40.1...1.40.2) (2020-11-10)


### Bug Fixes

* **pipelines:** pm2-build typo [skip ci] ([acbb837](https://github.com/openupm/openupm/commit/acbb8377583d2e30bb95c1c0cbd255fd4cb96aca))
* **pipelines:** sort package related jobs by -mtime ([e1bfc36](https://github.com/openupm/openupm/commit/e1bfc36c699a0e1dd73cbe62707a4ed1198f027b))

## [1.40.1](https://github.com/openupm/openupm/compare/1.40.0...1.40.1) (2020-11-09)


### Bug Fixes

* **pipelines:** add connection timeout to network jobs [skip ci] ([1f91b6d](https://github.com/openupm/openupm/commit/1f91b6d4d9396d04309715ff65011a123ad4a3de))

# [1.40.0](https://github.com/openupm/openupm/compare/1.39.1...1.40.0) (2020-11-08)


### Features

* **i18n:** add Chinese website (refs [#1581](https://github.com/openupm/openupm/issues/1581)) ([7d5ab49](https://github.com/openupm/openupm/commit/7d5ab492e33922e393434df215795bc54bc39092))

## [1.39.1](https://github.com/openupm/openupm/compare/1.39.0...1.39.1) (2020-10-12)


### Bug Fixes

* **pipelines:** add error code PackageJsonParsingError ([01c9857](https://github.com/openupm/openupm/commit/01c98576c0a30faf7360cd5ef06dbc233a3378bd))
* **pipelines:** handle ETIMEOUT for the build-release job ([530705a](https://github.com/openupm/openupm/commit/530705af683e132b4a83a1d269a675c3723f5c92))

# [1.39.0](https://github.com/openupm/openupm/compare/1.38.0...1.39.0) (2020-10-11)


### Features

* **website:** remember sort-by option value for the package list ([52e6a15](https://github.com/openupm/openupm/commit/52e6a15b6c38d72ca3b412c16adbd68fd63e32dd))

# [1.38.0](https://github.com/openupm/openupm/compare/1.37.10...1.38.0) (2020-10-03)


### Features

* **website:** integrate nprogress bar to network activity ([029b86f](https://github.com/openupm/openupm/commit/029b86f96155b28917e1dc13b4137932d94fa3bc))

## [1.37.10](https://github.com/openupm/openupm/compare/1.37.9...1.37.10) (2020-10-03)


### Bug Fixes

* **pipelines:** prefer annotated tag over lightweight tag. ([9233d3e](https://github.com/openupm/openupm/commit/9233d3ee9ea5861a11ed8546dcbaab67020994a2))

## [1.37.9](https://github.com/openupm/openupm/compare/1.37.8...1.37.9) (2020-10-02)


### Bug Fixes

* **website:** change applayout to use page mode for contentview ([0c0f43f](https://github.com/openupm/openupm/commit/0c0f43f4349e1996729d9d5357e793e5770143fd))

## [1.37.8](https://github.com/openupm/openupm/compare/1.37.7...1.37.8) (2020-10-01)


### Bug Fixes

* **website:** move installation info to an extra subpage of the package detail page on mobile ([53120ca](https://github.com/openupm/openupm/commit/53120ca39078696f2f2ea3a719954c4d12c22881))
* **website:** recover parent owner on package card ([332cfe9](https://github.com/openupm/openupm/commit/332cfe98cdfee2c6b29026d5fe2f07ca6f049bd8))

## [1.37.7](https://github.com/openupm/openupm/compare/1.37.6...1.37.7) (2020-10-01)


### Bug Fixes

* **website:** switch back to OS scrollbar (close [#1396](https://github.com/openupm/openupm/issues/1396)) ([454592f](https://github.com/openupm/openupm/commit/454592f9139842ddc593341ae87f94193152e8ae))

## [1.37.6](https://github.com/openupm/openupm/compare/1.37.5...1.37.6) (2020-10-01)


### Bug Fixes

* **website:** hydration error for package list and detail pages (close [#1383](https://github.com/openupm/openupm/issues/1383), the second try) ([92b04a0](https://github.com/openupm/openupm/commit/92b04a0dfc58ee49e733cd51cc3110a69feec04f))

## [1.37.5](https://github.com/openupm/openupm/compare/1.37.4...1.37.5) (2020-09-30)


### Bug Fixes

* **website:** missing packages/index.html for SSR (close [#1383](https://github.com/openupm/openupm/issues/1383), refs [#1341](https://github.com/openupm/openupm/issues/1341)) ([7415424](https://github.com/openupm/openupm/commit/7415424a6c4667d07a781fc6769eba67a5fecef0))

## [1.37.4](https://github.com/openupm/openupm/compare/1.37.3...1.37.4) (2020-09-29)


### Bug Fixes

* **website:** detect ready-to-use package count issue ([20f5e60](https://github.com/openupm/openupm/commit/20f5e6008f40ef364024636745a0339686ebbda2))

## [1.37.3](https://github.com/openupm/openupm/compare/1.37.2...1.37.3) (2020-09-29)


### Bug Fixes

* **website:** pending package detection issue ([cce8dc5](https://github.com/openupm/openupm/commit/cce8dc5bcfe6d3c86e5b41aad3c6065071b90c89))

## [1.37.2](https://github.com/openupm/openupm/compare/1.37.1...1.37.2) (2020-09-29)


### Bug Fixes

* **pipelines:** use pushed time when updated time is not available (refs [#1341](https://github.com/openupm/openupm/issues/1341)) ([ae73485](https://github.com/openupm/openupm/commit/ae73485cb737f24d67c992246055a08e0735231a))

## [1.37.1](https://github.com/openupm/openupm/compare/1.37.0...1.37.1) (2020-09-29)


### Bug Fixes

* **website:** ads placement for app layout ([2787928](https://github.com/openupm/openupm/commit/2787928438341ab4df3a1aac405788cc9a68ac43))

# [1.37.0](https://github.com/openupm/openupm/compare/1.36.0...1.37.0) (2020-09-29)


### Features

* **wesbite:** change package detail to app layout ([6086fcb](https://github.com/openupm/openupm/commit/6086fcbb9d4ce8a00620cd2ec17dd72f38142092))

# [1.36.0](https://github.com/openupm/openupm/compare/1.35.0...1.36.0) (2020-09-20)


### Bug Fixes

* **website:** passing correct element key for vue lister item rendering ([a90c435](https://github.com/openupm/openupm/commit/a90c4356203eb801ea1169dd34b9d212e0455d30))


### Features

* **website:** use lazy component for package card ([0f2bff1](https://github.com/openupm/openupm/commit/0f2bff172d060c9406aaae03176a56f98af7416c))
* **website:** use lazy image for package card ([a03d94f](https://github.com/openupm/openupm/commit/a03d94fa9f881e96761d80894a76936d208bf2b3))
* **website:** use lazy image for the contributor page ([b4a9b33](https://github.com/openupm/openupm/commit/b4a9b335e0b6e390436e2bcf2f69dbce11baf419))
* change package list to app layout ([bdfbc9b](https://github.com/openupm/openupm/commit/bdfbc9b2742b2850370c20cd301067690c8a952f))

# [1.35.0](https://github.com/openupm/openupm/compare/1.34.0...1.35.0) (2020-08-25)


### Features

* **website:** show GitHub stars count on the star button. ([61d7cc5](https://github.com/openupm/openupm/commit/61d7cc54d9bc0700501c18f2cf7af0c3fd0f7963))

# [1.34.0](https://github.com/openupm/openupm/compare/1.33.0...1.34.0) (2020-08-24)


### Features

* **website:** flexsearch widget ([50977e0](https://github.com/openupm/openupm/commit/50977e0ea4c76712bacd3981eff5579e4848f491))

# [1.33.0](https://github.com/openupm/openupm/compare/1.32.0...1.33.0) (2020-08-20)


### Features

* **pipelines:** add scopes to package extra data ([8f78c87](https://github.com/openupm/openupm/commit/8f78c8725628b630c288ec088daa4e18c768900a))
* **website:** integrate with Needle's package installer ([2d90109](https://github.com/openupm/openupm/commit/2d90109ec3b32f991dd9b011f762ef0d1df2d771))

# [1.32.0](https://github.com/openupm/openupm/compare/1.31.3...1.32.0) (2020-08-14)


### Features

* clickable avatars with GitHub URL ([#1211](https://github.com/openupm/openupm/issues/1211)) ([54395a8](https://github.com/openupm/openupm/commit/54395a804e0e66cc09f5af95768190479b2d5a08))

## [1.31.3](https://github.com/openupm/openupm/compare/1.31.2...1.31.3) (2020-08-08)


### Bug Fixes

* **pipelines:** get undefined status bug ([8119b6e](https://github.com/openupm/openupm/commit/8119b6ed97ea6092605e86cbd6cb586501e3df58))

## [1.31.2](https://github.com/openupm/openupm/compare/1.31.1...1.31.2) (2020-07-28)


### Bug Fixes

* **pipelines:** sort queue status output [skip ci] ([6cc4ffb](https://github.com/openupm/openupm/commit/6cc4ffb3edcdd7e1d396cc11dc1fa7bf15d03e2f))

## [1.31.1](https://github.com/openupm/openupm/compare/1.31.0...1.31.1) (2020-07-24)


### Bug Fixes

* **pipelines:** add error code PackageNameInvalid ([b4d4ba0](https://github.com/openupm/openupm/commit/b4d4ba08b9fb0480f0370f04bcbd0b0fb076a3a9))

# [1.31.0](https://github.com/openupm/openupm/compare/1.30.6...1.31.0) (2020-07-21)


### Features

* **website:** support GFM style emoji in README renderer ([72dec82](https://github.com/openupm/openupm/commit/72dec829a4ec5b1ba9beaf07b035ad4cea4ffff0))

## [1.30.6](https://github.com/openupm/openupm/compare/1.30.5...1.30.6) (2020-07-19)


### Bug Fixes

* **website:** handle escaped character in markdown renderer (close: [#1112](https://github.com/openupm/openupm/issues/1112)) ([7eab41c](https://github.com/openupm/openupm/commit/7eab41caebbf8c11c9bed9a535b685e8fbce98a6))

## [1.30.5](https://github.com/openupm/openupm/compare/1.30.4...1.30.5) (2020-06-21)


### Bug Fixes

* **website:** fix og:image ([25f675e](https://github.com/openupm/openupm/commit/25f675ed22bf1d6ae73027b6b91d37d775865a06))

## [1.30.4](https://github.com/openupm/openupm/compare/1.30.3...1.30.4) (2020-06-21)


### Bug Fixes

* **pipelines:** fix pm2 configure ([c31a5fa](https://github.com/openupm/openupm/commit/c31a5faada34b63ebce46e014d426d04150e33f0))

## [1.30.3](https://github.com/openupm/openupm/compare/1.30.2...1.30.3) (2020-06-21)


### Performance Improvements

* **website:** allow first request hit the cache ([36e7ab3](https://github.com/openupm/openupm/commit/36e7ab3f9ade699367d480ae92800cc1ce403f8c))

## [1.30.2](https://github.com/openupm/openupm/compare/1.30.1...1.30.2) (2020-06-21)


### Performance Improvements

* **backend:** move readme rendering to backend ([4b45686](https://github.com/openupm/openupm/commit/4b456868d06ae91b9df7cfe14c6755625e85b64d))
* **website:** optimize lodash and date-fns library sizes ([a53b2af](https://github.com/openupm/openupm/commit/a53b2af968a4a0fe0a1a64fbdca266124844c345))
* **website:** remove flowchart plugin ([24321c2](https://github.com/openupm/openupm/commit/24321c2506486a767f9041f3d235fd1f454942c7))

## [1.30.1](https://github.com/openupm/openupm/compare/1.30.0...1.30.1) (2020-06-20)


### Performance Improvements

* **website:** optimize relate packages to reduce the siteData.js size ([ba61f05](https://github.com/openupm/openupm/commit/ba61f0562b8fdeb8d3efd29761be4a508569f6dc))

# [1.30.0](https://github.com/openupm/openupm/compare/1.29.1...1.30.0) (2020-06-08)


### Features

* **website:** code highlighting of package README (close: [#606](https://github.com/openupm/openupm/issues/606)) ([dcdb95b](https://github.com/openupm/openupm/commit/dcdb95b26ce01bfdbc1de1586e4246e80cded6ec))

## [1.29.1](https://github.com/openupm/openupm/compare/1.29.0...1.29.1) (2020-06-07)


### Bug Fixes

* **pipelines:** minVersion should be parsed ([668dc18](https://github.com/openupm/openupm/commit/668dc1830d28fecaf42a7d21b38bb0aea4f56390))

# [1.29.0](https://github.com/openupm/openupm/compare/1.28.0...1.29.0) (2020-05-23)


### Features

* **website:** remove parent stars from package detail page (close: [#525](https://github.com/openupm/openupm/issues/525)) ([865ee29](https://github.com/openupm/openupm/commit/865ee29df6891b633182713d344f692bc68b443f))

# [1.28.0](https://github.com/openupm/openupm/compare/1.27.1...1.28.0) (2020-05-23)


### Features

* **website:** package-add form parses license from package.json ([2706a1f](https://github.com/openupm/openupm/commit/2706a1f001174879df443e8f9eab61a3c5fefaa1))

## [1.27.1](https://github.com/openupm/openupm/compare/1.27.0...1.27.1) (2020-05-20)


### Bug Fixes

* **website:** improve UX for Git dependencies ([d68577c](https://github.com/openupm/openupm/commit/d68577c1a49deb47a98719d3b8f647200cfe56bc))

# [1.27.0](https://github.com/openupm/openupm/compare/1.26.0...1.27.0) (2020-05-13)


### Features

* **website:** alert Git dependencies on package detail page (refs: [#426](https://github.com/openupm/openupm/issues/426)) ([4874027](https://github.com/openupm/openupm/commit/48740272d955942a7bfd2d031de3ce7b1a0d3a75))

# [1.26.0](https://github.com/openupm/openupm/compare/1.25.1...1.26.0) (2020-05-12)


### Features

* **pipelines:** support minVersion field to filter Git tags ([3d314f7](https://github.com/openupm/openupm/commit/3d314f79c03581a51e1a7f097008cb76164c658f))

## [1.25.1](https://github.com/openupm/openupm/compare/1.25.0...1.25.1) (2020-05-10)


### Bug Fixes

* **website:** pending state on the package detail page ([6d9a027](https://github.com/openupm/openupm/commit/6d9a027dbb262c89d434d5abafef8e32fb1093f3))

# [1.25.0](https://github.com/openupm/openupm/compare/1.24.0...1.25.0) (2020-05-10)


### Features

* **website:** filter pending state on the package list page (refs [#277](https://github.com/openupm/openupm/issues/277)) ([bf8101b](https://github.com/openupm/openupm/commit/bf8101bd107a781f607b6add1a6dc047bc4ac2b2))

# [1.24.0](https://github.com/openupm/openupm/compare/1.23.2...1.24.0) (2020-05-08)


### Features

* **website:** show pending state on package list page (close:  [#277](https://github.com/openupm/openupm/issues/277)) ([c3420d3](https://github.com/openupm/openupm/commit/c3420d31d8134593d1b824e4cbdebfa2027bf335))

## [1.23.2](https://github.com/openupm/openupm/compare/1.23.1...1.23.2) (2020-05-05)


### Bug Fixes

* **website:** exclude ignored or non-prefixed tags from invalid tags of the package detail page (close: [#90](https://github.com/openupm/openupm/issues/90)) ([8332f6b](https://github.com/openupm/openupm/commit/8332f6bd7737b0ffecb60d3f55fc7769e565dc8d))

## [1.23.1](https://github.com/openupm/openupm/compare/1.23.0...1.23.1) (2020-05-05)


### Bug Fixes

* **website:** reimplement unity version filter of package list page (refs [#53](https://github.com/openupm/openupm/issues/53)) ([7396957](https://github.com/openupm/openupm/commit/73969570a8a8b4c336382d8d42f66992d81d759e))

# [1.23.0](https://github.com/openupm/openupm/compare/1.22.1...1.23.0) (2020-05-04)


### Features

* **website:** choice README in package submission form (close [#91](https://github.com/openupm/openupm/issues/91)) ([e423ade](https://github.com/openupm/openupm/commit/e423ade83f85d4b987a9b5ce3f92dfd2b8acd5eb))

## [1.22.1](https://github.com/openupm/openupm/compare/1.22.0...1.22.1) (2020-05-04)


### Bug Fixes

* **website:** fix readme image with absolute URL ([ce20410](https://github.com/openupm/openupm/commit/ce20410552c78194cfaf84f32101226e427a6aa5))

# [1.22.0](https://github.com/openupm/openupm/compare/1.21.0...1.22.0) (2020-05-04)


### Features

* **website:** support README at any path ([#238](https://github.com/openupm/openupm/issues/238), [#91](https://github.com/openupm/openupm/issues/91)) ([d8fb7d5](https://github.com/openupm/openupm/commit/d8fb7d511d9c5eba5f7816c715ccbcd5aff55af8))

# [1.21.0](https://github.com/openupm/openupm/compare/1.20.5...1.21.0) (2020-05-02)


### Features

* **website:** one-column for package lister view (refs: [#227](https://github.com/openupm/openupm/issues/227)) ([87e417a](https://github.com/openupm/openupm/commit/87e417a91197e0e9c28fae777ac01d62cb900a86))

## [1.20.5](https://github.com/openupm/openupm/compare/1.20.4...1.20.5) (2020-05-01)


### Bug Fixes

* **website:** two-column filter for lister pages on mobile ([de75322](https://github.com/openupm/openupm/commit/de753227f6d10bad7727a682d05c73b9675e8c45))

## [1.20.4](https://github.com/openupm/openupm/compare/1.20.3...1.20.4) (2020-05-01)


### Bug Fixes

* **website:** remove duplicated unity version option on the package list page ([fba21cb](https://github.com/openupm/openupm/commit/fba21cb513fcd7f954db30c731dd8d86f7247e62))

## [1.20.3](https://github.com/openupm/openupm/compare/1.20.2...1.20.3) (2020-05-01)


### Bug Fixes

* **website:** remove masonry layout for package cards (refs: [#227](https://github.com/openupm/openupm/issues/227)) ([a51bfe9](https://github.com/openupm/openupm/commit/a51bfe9a882e1b12335331861c029847c755bb16))

## [1.20.2](https://github.com/openupm/openupm/compare/1.20.1...1.20.2) (2020-04-29)


### Bug Fixes

* **website:** avoid link with target=_blank (close: [#228](https://github.com/openupm/openupm/issues/228)) ([a540e61](https://github.com/openupm/openupm/commit/a540e619e748e047230ee5d56bc2b05c4cb5cd26))

## [1.20.1](https://github.com/openupm/openupm/compare/1.20.0...1.20.1) (2020-04-29)


### Bug Fixes

* **website:** feed redirect rules. ([e462a14](https://github.com/openupm/openupm/commit/e462a1481905ffcf5e6a4ee8f5671b9fa5fa3969))

# [1.20.0](https://github.com/openupm/openupm/compare/1.19.1...1.20.0) (2020-04-29)


### Features

* package update feed (refs [#48](https://github.com/openupm/openupm/issues/48)) ([32b4991](https://github.com/openupm/openupm/commit/32b49918406b0a3fdbe95ab994b564468c7839ac))

## [1.19.1](https://github.com/openupm/openupm/compare/1.19.0...1.19.1) (2020-04-26)


### Bug Fixes

* **pipelines:** support underscore prefix ([0e9865f](https://github.com/openupm/openupm/commit/0e9865f1c0ab1048341285f3892ed5291bb0ad89))

# [1.19.0](https://github.com/openupm/openupm/compare/1.18.5...1.19.0) (2020-04-23)


### Bug Fixes

* **website:** duplicated unity list ([ad065e5](https://github.com/openupm/openupm/commit/ad065e5672348d379ac10c1c36b2e28d4c871b99))


### Features

* **website:** sort package by last update time ([b35d77a](https://github.com/openupm/openupm/commit/b35d77aa3116ad1a3c117947dd0b484088e72454))

## [1.18.5](https://github.com/openupm/openupm/compare/1.18.4...1.18.5) (2020-04-02)


### Bug Fixes

* treat ReleaseReason.None as a retryable reason (close: [#137](https://github.com/openupm/openupm/issues/137)) ([9b372a2](https://github.com/openupm/openupm/commit/9b372a252a46b3409be4bdfb170fd73c824093cb))

## [1.18.4](https://github.com/openupm/openupm/compare/1.18.3...1.18.4) (2020-03-31)


### Bug Fixes

* **website:** package card title overflow-wrap ([d660a43](https://github.com/openupm/openupm/commit/d660a43b9143648b7c7bf933bec911c176e7f4a7))

## [1.18.3](https://github.com/openupm/openupm/compare/1.18.2...1.18.3) (2020-03-18)


### Bug Fixes

* edge case when parsing readme image path (close: [#120](https://github.com/openupm/openupm/issues/120)) ([dde1e10](https://github.com/openupm/openupm/commit/dde1e108104a8697452aff2e4a4886aef2818a68))

## [1.18.2](https://github.com/openupm/openupm/compare/1.18.1...1.18.2) (2020-03-10)


### Bug Fixes

* **web:** recent packages shall respect excludedFromList property ([48856d9](https://github.com/openupm/openupm/commit/48856d9d5ad3970ab1638d07d6cb052d6896a996))

## [1.18.1](https://github.com/openupm/openupm/compare/1.18.0...1.18.1) (2020-02-26)


### Bug Fixes

* **pipelines:** the passed gitTagPrefix is incorrect ([08c5b59](https://github.com/openupm/openupm/commit/08c5b59472e3e85d184642fe6e8dc29657cafda4))

# [1.18.0](https://github.com/openupm/openupm/compare/1.17.1...1.18.0) (2020-02-22)


### Features

* **pipelines:** add gitTagPrefix field to filter git tags (close: [#69](https://github.com/openupm/openupm/issues/69)) ([bf82be8](https://github.com/openupm/openupm/commit/bf82be893eb284b3fb898fa0ff3ad487bd8166e9))

## [1.17.1](https://github.com/openupm/openupm/compare/1.17.0...1.17.1) (2020-02-12)


### Bug Fixes

* **cli:** queue:status ignores stallBlock ([bf955a2](https://github.com/openupm/openupm/commit/bf955a25d12701cb77a5f7da2f8caaea1bc2ca8d))

# [1.17.0](https://github.com/openupm/openupm/compare/1.16.0...1.17.0) (2020-02-12)


### Features

* **cli:** add queue:status command ([b05537b](https://github.com/openupm/openupm/commit/b05537bd2a340eb14d48695e6557209cdbf21093))

# [1.16.0](https://github.com/openupm/openupm/compare/1.15.1...1.16.0) (2020-02-11)


### Features

* **website:** [#53](https://github.com/openupm/openupm/issues/53) filter package list by supported Unity version ([716e322](https://github.com/openupm/openupm/commit/716e32296c2ca6def4aebaf895a999ea680b35a3))

## [1.15.1](https://github.com/openupm/openupm/compare/1.15.0...1.15.1) (2020-02-11)


### Bug Fixes

* **pipelines:** add GitHub token for pkg:fetch-extra command ([fed3a62](https://github.com/openupm/openupm/commit/fed3a626f05e016979e7d9c450baa1ec39c8df8f))

# [1.15.0](https://github.com/openupm/openupm/compare/1.14.0...1.15.0) (2020-02-10)


### Bug Fixes

* **website:** topic link missing active class ([28f176a](https://github.com/openupm/openupm/commit/28f176ae82891010f5e92cfa33d4ae9bde51a7b4))


### Features

* **ci:** reload pkg-extra process ([ea7b23f](https://github.com/openupm/openupm/commit/ea7b23f97e5465e9ac9421fdeea16bbc9a39ed79))

# [1.14.0](https://github.com/openupm/openupm/compare/1.13.3...1.14.0) (2020-02-10)


### Features

* **api:** add /packages/extra endpoint ([3ee2bbb](https://github.com/openupm/openupm/commit/3ee2bbbd9419a110a5b726657ce266fb81cfac69))
* **cli:** add script to fetch package extra data ([cd957a9](https://github.com/openupm/openupm/commit/cd957a9ce5fd1f54649153e9df48bed8dfd99598))
* **website:** sort by popularity ([a7ac402](https://github.com/openupm/openupm/commit/a7ac4022a20c9ddcdd9692284cc04e7915ec11dd))

## [1.13.3](https://github.com/openupm/openupm/compare/1.13.2...1.13.3) (2020-02-10)


### Bug Fixes

* **website:** show git tag on build issues of package detail page ([2b8bd5a](https://github.com/openupm/openupm/commit/2b8bd5aaee0d936528899f02e5d3456618b378a3))

## [1.13.2](https://github.com/openupm/openupm/compare/1.13.1...1.13.2) (2020-02-10)


### Bug Fixes

* **pipelines:** support tag with _upm suffix ([09b5c82](https://github.com/openupm/openupm/commit/09b5c82abd780fae87e36c97eadaf6e4237ef6d7))

## [1.13.1](https://github.com/openupm/openupm/compare/1.13.0...1.13.1) (2020-02-10)


### Bug Fixes

* **pipelines:** support tag with _upm suffix ([ea38fbc](https://github.com/openupm/openupm/commit/ea38fbc5e935eee984ed1ccec09c87a370690f2a))

# [1.13.0](https://github.com/openupm/openupm/compare/1.12.0...1.13.0) (2020-02-09)


### Features

* **cli:** show no git tag from pkg:check command ([8788c30](https://github.com/openupm/openupm/commit/8788c30c1d50948e8559eea24a499eae15ffb9e0))

# [1.12.0](https://github.com/openupm/openupm/compare/1.11.1...1.12.0) (2020-02-08)


### Features

* **cli:** show git dependencies from check-deps command ([e9fc22b](https://github.com/openupm/openupm/commit/e9fc22b9d55fbed04ffd4287c23b71e8829f28a0))

## [1.11.1](https://github.com/openupm/openupm/compare/1.11.0...1.11.1) (2020-02-08)


### Bug Fixes

* **website:** show unity version as tooltip on package detail page ([7184510](https://github.com/openupm/openupm/commit/7184510cb5bbb2e78d8cea1a29fd02f3a90209b4))

# [1.11.0](https://github.com/openupm/openupm/compare/1.10.1...1.11.0) (2020-02-08)


### Bug Fixes

* **website:** package detail style fix ([1dff6ca](https://github.com/openupm/openupm/commit/1dff6ca00d5a8f1c393fc5d7c3f0603aedfc0459))


### Features

* **cli:** add script to check dependencies ([e9a325e](https://github.com/openupm/openupm/commit/e9a325ef137628a06f28c181c1346447d634bfcb))

## [1.10.1](https://github.com/openupm/openupm/compare/1.10.0...1.10.1) (2020-02-08)


### Bug Fixes

* **website:** missing link for unity dependencies ([5751daa](https://github.com/openupm/openupm/commit/5751daaa558efa28acb8a219a450d4dc8964b913))

# [1.10.0](https://github.com/openupm/openupm/compare/1.9.0...1.10.0) (2020-02-07)


### Features

* **website:** show dependencies on package detail page ([089d530](https://github.com/openupm/openupm/commit/089d530018ab266155ca6b2c07972f644ade4ed1))

# [1.9.0](https://github.com/openupm/openupm/compare/1.8.2...1.9.0) (2020-02-06)


### Features

* **website:** show supported Unity version on package detail page (fix [#52](https://github.com/openupm/openupm/issues/52)) ([8d728ba](https://github.com/openupm/openupm/commit/8d728ba3c00f2b1a1b6c31ff0688b7fb321dd124))

## [1.8.2](https://github.com/openupm/openupm/compare/1.8.1...1.8.2) (2020-02-02)


### Bug Fixes

* **pipelines:** handle git tags from both upm and master branches ([40536f7](https://github.com/openupm/openupm/commit/40536f707027d2b8f673c34b1d1c4720c56f7f05))

## [1.8.1](https://github.com/openupm/openupm/compare/1.8.0...1.8.1) (2020-01-28)


### Bug Fixes

* **website:** package detail page vue warning ([c44555e](https://github.com/openupm/openupm/commit/c44555e587a6ea492099b1e62dacf641416a2bb2))
* **website:** rollback getGitHubRawUrl to work with LFS ([6fc7823](https://github.com/openupm/openupm/commit/6fc7823e2e9c3ce82b7ea928bbbe4cb1ae2bd8d3))

# [1.8.0](https://github.com/openupm/openupm/compare/1.7.0...1.8.0) (2020-01-28)


### Features

* **website:** retired repoBranch field of package yaml ([289af62](https://github.com/openupm/openupm/commit/289af626e58adce5b2d1e6a1c92dc176262ef465))

# [1.7.0](https://github.com/openupm/openupm/compare/1.6.0...1.7.0) (2020-01-26)


### Features

* **website:** show package topics on detail pages ([79c37a4](https://github.com/openupm/openupm/commit/79c37a4e02b01701666e4fb93cca1bdd792bcc99))

# [1.6.0](https://github.com/openupm/openupm/compare/1.5.2...1.6.0) (2020-01-25)


### Features

* **website:** add asterisk for required fields ([4cc8058](https://github.com/openupm/openupm/commit/4cc80584d0e203527d19127081bddea5388e4c41))
* **website:** select featured image when adding packages ([d6a742d](https://github.com/openupm/openupm/commit/d6a742d9c023c488f8b1113e1ee1d66a45e212c3))

## [1.5.2](https://github.com/openupm/openupm/compare/1.5.1...1.5.2) (2020-01-22)


### Bug Fixes

* **pipelines:** treat label/semver as valid semver tag ([298ff08](https://github.com/openupm/openupm/commit/298ff08de075b046f31c8c5558967a74575e9021))

## [1.5.1](https://github.com/openupm/openupm/compare/1.5.0...1.5.1) (2020-01-19)


### Bug Fixes

* **website:** crop package card image width ([ea218bb](https://github.com/openupm/openupm/commit/ea218bb45f5dadab0d03ab9b973319bcd14c5613))

# [1.5.0](https://github.com/openupm/openupm/compare/1.4.1...1.5.0) (2020-01-18)


### Bug Fixes

* **website:** homepage vue warning ([29c5946](https://github.com/openupm/openupm/commit/29c594699fbf8868f33b783630e788942f1d341e))


### Features

* **website:** change package list to masonry layout ([8625574](https://github.com/openupm/openupm/commit/8625574a2e752f217ceef258511883e74b7be078))

## [1.4.1](https://github.com/openupm/openupm/compare/1.4.0...1.4.1) (2020-01-17)


### Bug Fixes

* **website:** recently added packages widget ordering ([e38c74c](https://github.com/openupm/openupm/commit/e38c74c71c31c9dc2681ab626f55a5bc9f4a95cf))
* **website:** update package card style ([f891744](https://github.com/openupm/openupm/commit/f891744441b6aa5f76cb5f60d5c2d4d66aba994b))

# [1.4.0](https://github.com/openupm/openupm/compare/1.3.2...1.4.0) (2020-01-17)


### Features

* **website:** recently added packages widget ([31e10f4](https://github.com/openupm/openupm/commit/31e10f4617d87ce8792440dfce4ceeb4d7ab356a))

## [1.3.2](https://github.com/openupm/openupm/compare/1.3.1...1.3.2) (2020-01-17)


### Bug Fixes

* **ci:** git pull failure ([f07cb02](https://github.com/openupm/openupm/commit/f07cb0224e3b4a871fdcad22d5faf6c5a05b2bcf))

## [1.3.1](https://github.com/openupm/openupm/compare/1.3.0...1.3.1) (2020-01-16)


### Bug Fixes

* **website:** package list show recently added package by default ([59450af](https://github.com/openupm/openupm/commit/59450af983e91f7670c0ea5f9e2c44d015ba6b4a))

# [1.3.0](https://github.com/openupm/openupm/compare/1.2.0...1.3.0) (2020-01-16)


### Features

* **website:** add sort option for package list ([e544b5f](https://github.com/openupm/openupm/commit/e544b5fa0c1cfe556fd5257dd667f2b312879b30))

# [1.2.0](https://github.com/openupm/openupm/compare/1.1.1...1.2.0) (2020-01-16)


### Features

* **website:** add createdAt timestamp to package add form ([80028a9](https://github.com/openupm/openupm/commit/80028a9d9fd65856fec05186231ae6688c72290f))

## [1.1.1](https://github.com/openupm/openupm/compare/1.1.0...1.1.1) (2020-01-14)


### Bug Fixes

* **ci:** syntax error for mergify configuration file ([3df6dc4](https://github.com/openupm/openupm/commit/3df6dc443c34a94edb2845b1216b7207e08e3492))

# [1.1.0](https://github.com/openupm/openupm/compare/1.0.0...1.1.0) (2020-01-13)


### Features

* **website:** collapse blog and chat nav links ([b6f6978](https://github.com/openupm/openupm/commit/b6f6978acb5127558c0ed8ae2d6752b0a2740948))

# 1.0.0 (2020-01-13)


### Bug Fixes

* **pipelines:** correct publish log parsing url ([bde158c](https://github.com/openupm/openupm/commit/bde158c571bfda71bd2a9b18eebd8f476fed765f))
* **pipelines:** no longer pass buildName context variable ([467f4c8](https://github.com/openupm/openupm/commit/467f4c828982444b21961bc13040589505373d1e))
* **pipelines:** semver supports upper case ([44687e2](https://github.com/openupm/openupm/commit/44687e29fe663683fa42dde9d2d0a5742c62cbac))
* **website:** add package form should update step after clicking the upload button ([0a0661f](https://github.com/openupm/openupm/commit/0a0661f640dbaa72ff29e3f0987a7a3b1041352a))
* **website:** broken image due to unconverted hardcoded html image tag ([f3ea89d](https://github.com/openupm/openupm/commit/f3ea89d030d273604f6aa50299eb8a99142b4fa5))
* **website:** broken image for unconverted GitHub image link ([564dd67](https://github.com/openupm/openupm/commit/564dd673b74852b85f2d27a5052bea88818956f3))
* **website:** change the commit message for adding new package ([8ece1f7](https://github.com/openupm/openupm/commit/8ece1f706acf149c6128fe1a4417aeb07c0e9d63))
* add requiredArgs back to commander ([917d806](https://github.com/openupm/openupm/commit/917d806135552329c248ed30d0c72c33ab41c7b0))
* avoid page specific style leak ([05200d2](https://github.com/openupm/openupm/commit/05200d2ea032546401dbb713da30afb29d0588f2))
* build log steps ([c63340d](https://github.com/openupm/openupm/commit/c63340de644bf551d019bf0b251bd2b77302f905))
* build package job supports package folder ([1dfb307](https://github.com/openupm/openupm/commit/1dfb307c4d8e55a93fbc8cc35097956fde54652b))
* build pipeline crash with retryable reason ([1ac92c2](https://github.com/openupm/openupm/commit/1ac92c2c131559e20e066ff62dc78663d771358c))
* build reason ([5b7fca4](https://github.com/openupm/openupm/commit/5b7fca43c0e024a79dfbfe074294f43355263f76))
* change sitemap to dev dependency ([e11a13f](https://github.com/openupm/openupm/commit/e11a13f10b79fa369c413233e8217ed136f7d5c9))
* ci add redis matrix ([e2d9f43](https://github.com/openupm/openupm/commit/e2d9f4335cdd1c3cb53a87a8880522ea325eb35b))
* ci add redis ping ([4ff2905](https://github.com/openupm/openupm/commit/4ff29055f265c37740f6b63e87079787c2fd4d07))
* ci setup redis ([cc9fd91](https://github.com/openupm/openupm/commit/cc9fd913d2735eea9cdfabc7f43e7c4b62b6faa9))
* ci use yarn directly ([7cc2608](https://github.com/openupm/openupm/commit/7cc2608d5e310ef5486fc0792052405ddf126df1))
* clean logger level ([bbcb96f](https://github.com/openupm/openupm/commit/bbcb96fa22aba96e0ecb6d412901f3b51c1f19b4))
* clean logger level ([d525428](https://github.com/openupm/openupm/commit/d52542891afa01a8e9f1fcba6e304dd552803907))
* disabled pwa plugin ([dcbabd2](https://github.com/openupm/openupm/commit/dcbabd2a64fcf8fa4cfd90636031004f820fc826))
* github deploy action adds skip message ([a991131](https://github.com/openupm/openupm/commit/a99113186493b8580a0bfb52bc4ba6e3729ca3fc))
* github deploy action handles merge log ([64cbcd8](https://github.com/openupm/openupm/commit/64cbcd88470156c3493e5ec034558ed640cc1edb))
* github deploy action limited on certain changed paths ([46d8a13](https://github.com/openupm/openupm/commit/46d8a132366091ffde4cd46cc912129a91391aa7))
* github deploy action limited to master branch ([1348333](https://github.com/openupm/openupm/commit/1348333ba4297bd790fdf1403e298dfae55a58a0))
* github deploy action reloads queue-main, pkg-build seperately ([1da16bb](https://github.com/openupm/openupm/commit/1da16bbf816a3050f37c8f5eaa7202c2d2a02883))
* github deploy action should update package before restart pm2 ([7994724](https://github.com/openupm/openupm/commit/79947248618772bf7b86adb0e3cdd420cb941ea3))
* github deploy action splited to two jobs ([06292f8](https://github.com/openupm/openupm/commit/06292f8353e6b6535d9382622ace1ba93323391a))
* github new file form parameters ([e86e56a](https://github.com/openupm/openupm/commit/e86e56a27d8608f1038f0f0ec2f2b630d6dc6121))
* hided related packages if not exist ([13cafa8](https://github.com/openupm/openupm/commit/13cafa8cf00e7d34660ad83647bb9ac45f1fc0fa))
* homepage text ([18cf568](https://github.com/openupm/openupm/commit/18cf568b4d73866eb43fee9e913006bc7d4b605d))
* log level warn, error to stderr ([bb23f05](https://github.com/openupm/openupm/commit/bb23f05df86bafc28154379e9b3e8dda622d9e62))
* missing plugins ([c57aa42](https://github.com/openupm/openupm/commit/c57aa42b1cb55eb4f3c678b53ac31259a36567de))
* mobile experience ([890eb4c](https://github.com/openupm/openupm/commit/890eb4ccf062deb6a09bfad2b53673c35b98abd2))
* mute logging in test mode ([d8bf062](https://github.com/openupm/openupm/commit/d8bf0624f45e0a7ed7c66725795301423314bddf))
* navbar texts ([1278135](https://github.com/openupm/openupm/commit/12781359966687d32068f3dadcb88982c4de00b7))
* netlify redirect ([9778dcc](https://github.com/openupm/openupm/commit/9778dcc09b38ba2ce549eb1ae93e594379d0d3f4))
* normal suffix ([278e2b5](https://github.com/openupm/openupm/commit/278e2b5dbdf83020ce6ee52551fb412f2620a7ad))
* package detail don't get fully updated after url change ([e9b3a5f](https://github.com/openupm/openupm/commit/e9b3a5fb90f471699b8ed9623d20d4136ee638c9))
* package detail install section layout ([77e8a37](https://github.com/openupm/openupm/commit/77e8a37332e051afbc743ec8128db62d0cc64ff3))
* package detail ol style ([a13f45c](https://github.com/openupm/openupm/commit/a13f45cba0032b72b1b2ecf6ea6baaf4a381ee7e))
* package detail openupm cli render issue ([193a085](https://github.com/openupm/openupm/commit/193a0857c9847ca8750df2f2bc1ade1492255996))
* package detail page includes building state to build issues section ([104253b](https://github.com/openupm/openupm/commit/104253be8279cea7fd18a2992595f2b2506380fa))
* package detail styles ([28783d8](https://github.com/openupm/openupm/commit/28783d800dc6f7ac2bdab8fa675027a60c1efd38))
* package detail version should be a successful build ([b340c0d](https://github.com/openupm/openupm/commit/b340c0d08f9dd440db696add358ae12404d3a22b))
* package readme h1 parser ([4bebcb0](https://github.com/openupm/openupm/commit/4bebcb030eca97653e30f71b45e03cdc36698593))
* package-add prompt ([2d2fcf6](https://github.com/openupm/openupm/commit/2d2fcf699b1494d15e646ee3e61425c034881114))
* redis connection ([adf782a](https://github.com/openupm/openupm/commit/adf782a90484ddd14b26bbf81d36b87d3e893854))
* redis connection ([18acca5](https://github.com/openupm/openupm/commit/18acca5cc576e308fa86d0c2a675b0d04f0b26f5))
* security update for serialize-javascript ([ab17683](https://github.com/openupm/openupm/commit/ab17683680f9c2904ac14b8c2e39c0689c990c20))
* test ([66937d3](https://github.com/openupm/openupm/commit/66937d37dfba55159876a9697d76357a0329b349))
* twitter og:image ([d4a3389](https://github.com/openupm/openupm/commit/d4a3389ede8a2044500241dca85415bf7b4d7921))
* typo ([d9c4945](https://github.com/openupm/openupm/commit/d9c4945983195c6b0fb825ea029f66050905f3a7))
* typo ([3f5b5f0](https://github.com/openupm/openupm/commit/3f5b5f01c7b9f8c018d074c2d483bb29fde1f028))
* typo ([66d502b](https://github.com/openupm/openupm/commit/66d502b8d04668bf27875876e09c79286bb24068))
* typo ([8932178](https://github.com/openupm/openupm/commit/893217875bf6af77cab991225eebda1232a64699))
* update package detail page for git tag ignore ([2d39871](https://github.com/openupm/openupm/commit/2d398717e34c48f35be238873be6b19ed4296eb0))
* update release.buildPublishResult ([4021d84](https://github.com/openupm/openupm/commit/4021d84ea7427f68553e56e60ce2f5afc1fc90e1))
* yarn commands ([ba91aa0](https://github.com/openupm/openupm/commit/ba91aa03cb498b3cdef7614956856faf4caae014))


### Features

* add error code PackageNameNotMatch ([857fc20](https://github.com/openupm/openupm/commit/857fc208ca4d7e67f1252cf0d06e0f82154d1055))
* add git tag ignore to package add form ([4ca1a1d](https://github.com/openupm/openupm/commit/4ca1a1dfb9ba35ded699b93ddc39ec773c787417))
* add test to github ci ([d2fc979](https://github.com/openupm/openupm/commit/d2fc979a630620848b7662d868509bc7dfa5619d))
* added github deploy action ([a7a506d](https://github.com/openupm/openupm/commit/a7a506d266bc5f2b6eb7e29f0e08195348606298))
* build package job supports package folder ([75d41bc](https://github.com/openupm/openupm/commit/75d41bc0095e5c8fbc661b9f1a2846d13c7ca649))
* chat room ([cce50c3](https://github.com/openupm/openupm/commit/cce50c3e2e8edbd2f98ea7de91b655a49e4bdda4))
* contributors page ([cf6a4a8](https://github.com/openupm/openupm/commit/cf6a4a8eae7dd27dbc2af319af60eeb83a656e64))
* discord chat ([60e88b6](https://github.com/openupm/openupm/commit/60e88b687e4393e81b4ae624d937645bd8c11258))
* do not remove job failed completely ([f1c523c](https://github.com/openupm/openupm/commit/f1c523c68946e246e627275628ea0928f2e5653f))
* edit page/package link ([712f16f](https://github.com/openupm/openupm/commit/712f16f5598497beb5151302f85cbfbd86a50744))
* enabled github workflow on PR ([9e83872](https://github.com/openupm/openupm/commit/9e83872d3346675fa0bbdbd0ea438f1c42001c35))
* exclude package from list page ([6773ff5](https://github.com/openupm/openupm/commit/6773ff5dcdd4d148a5ee27413947fc0d31f3ff6d))
* fallback to git install if no versions are available ([c6b2498](https://github.com/openupm/openupm/commit/c6b2498f51bce4ebb6828e30a7aa828d1b45477b))
* guess spdx license id from custom license name ([8bf13e4](https://github.com/openupm/openupm/commit/8bf13e4350326b11f0221f267ab21ff22483be73))
* ignore git tags from build pipelines ([5c945ef](https://github.com/openupm/openupm/commit/5c945ef6d43bae251ff19250cd0aad85d4b81545))
* new package com.baba_s.uni-scene-view-camera-aligner ([00dc198](https://github.com/openupm/openupm/commit/00dc198031d62ba942bfe92c86ec01e12249fc3b))
* new package com.coffee.git-dependency-resolver ([3fc7928](https://github.com/openupm/openupm/commit/3fc792853460b6528548b53737e69da42c8e902d))
* new package com.coffee.upm-git-extension ([56a2d37](https://github.com/openupm/openupm/commit/56a2d376dc8af0a00ff07182e425373952408d55))
* new package com.dbrizov.naughtyattributes ([b239204](https://github.com/openupm/openupm/commit/b23920454250609b595fd3867d66d5a4b9a58d23))
* new package com.e7.ecs.line-renderer ([2a8e69c](https://github.com/openupm/openupm/commit/2a8e69cdae83a770389e16f80af57790d5752d25))
* new package com.ecsrx.ecsrx.unity ([1a1a7b5](https://github.com/openupm/openupm/commit/1a1a7b582a91422a59d97e805bf80400abe93c80))
* new package com.eflatun.androidmanifesthook ([a486e2b](https://github.com/openupm/openupm/commit/a486e2bd9b57ecab8097a3c1b395985ce37b2648))
* new package com.eflatun.calculation ([18ebe33](https://github.com/openupm/openupm/commit/18ebe3387e53a7a31fb043a9a083ded42b788497))
* new package com.eflatun.codepatterns ([a2030e9](https://github.com/openupm/openupm/commit/a2030e9e6ed482094bf39c515cbfa392a4d8961d))
* new package com.eflatun.common ([56a3e27](https://github.com/openupm/openupm/commit/56a3e27921c29902b66024113cdb7110ebdb157b))
* new package com.eflatun.eventbus ([58d38d9](https://github.com/openupm/openupm/commit/58d38d9a58c2be2f402370febaecd3fad05956cc))
* new package com.eflatun.expansions ([5527fdb](https://github.com/openupm/openupm/commit/5527fdbf791aea6358439cdb4d4af58d36123be7))
* new package com.eflatun.geounity ([d21b5a1](https://github.com/openupm/openupm/commit/d21b5a144f7825d8c27b7af1b9b5f53590f4f7f4))
* new package com.eflatun.gridbuilding ([92b49b4](https://github.com/openupm/openupm/commit/92b49b48445cbec8b0f1d7af3ed282610d703452))
* new package com.eflatun.hexmath ([9cdf45c](https://github.com/openupm/openupm/commit/9cdf45cc770095f798f7678bcc73bded1c2f75e0))
* new package com.eflatun.inspector ([dc46401](https://github.com/openupm/openupm/commit/dc46401f3b6deb8e8ecc0dc0e3839d4f3821717a))
* new package com.eflatun.pooling ([f0a886e](https://github.com/openupm/openupm/commit/f0a886e9792a087080c319ade356491e02672428))
* new package com.eflatun.randomutils ([1209c6b](https://github.com/openupm/openupm/commit/1209c6babb9cf483347a0a3de8bf3c7b31f7a711))
* new package com.eflatun.sampling ([1fa4b13](https://github.com/openupm/openupm/commit/1fa4b13280238397f0419e0f311d259f7e46d3ba))
* new package com.eflatun.serialization ([6cacd89](https://github.com/openupm/openupm/commit/6cacd8915389ceca7353d5963de2f92cb58e9446))
* new package com.eflatun.tracking2d ([ecb7493](https://github.com/openupm/openupm/commit/ecb74934f7ab050854c8e7ca96de3b7bed21265c))
* new package com.eflatun.trajectory ([f022292](https://github.com/openupm/openupm/commit/f022292b036a75d277dc7c8ceafbf97e8c7d88f4))
* new package com.eflatun.ui ([692126d](https://github.com/openupm/openupm/commit/692126debd9ee98dd5ff30b197a6579eb0966e97))
* new package com.eflatun.webview ([2a62e85](https://github.com/openupm/openupm/commit/2a62e853bbe68a2525c291de4fb8f8d636b64951))
* new package com.grochoska.comm-unity-store ([b1b5c7d](https://github.com/openupm/openupm/commit/b1b5c7defbd72c12a518a8494d7169047a6b500f))
* new package com.grofit.bindingsrx ([792f6e1](https://github.com/openupm/openupm/commit/792f6e1301715d9cc2609c1ab83e975a2d8d238a))
* new package com.harryrose.assetdependencygraph ([a9c6efe](https://github.com/openupm/openupm/commit/a9c6efeabf732cfc8d7b10f7c5563cb53c9ef997))
* new package com.ionic.zlib ([0d6956d](https://github.com/openupm/openupm/commit/0d6956daebd4b07fa16671b77645f75a867e2f1a))
* new package com.jeffcampbellmakesgames.autopresets ([9efebf6](https://github.com/openupm/openupm/commit/9efebf68fc8f73a95dcdaf126b84175d271cce24))
* new package com.jimmycushnie.succ ([17f89aa](https://github.com/openupm/openupm/commit/17f89aa63a1c8bc241680796445efabd5aad82e1))
* new package com.jimmycushnie.ui-shapes-kit_jimmyfork ([7b86941](https://github.com/openupm/openupm/commit/7b8694138a59df28438fbe537ee0e06c5c5ee909))
* new package com.jimthekiwifruit.simplesingleton ([2a1a2f0](https://github.com/openupm/openupm/commit/2a1a2f0f57c7c3971159f69294be8c2e27255b24))
* new package com.johnsoncodehk.unity-asset-inspector ([63c0bc0](https://github.com/openupm/openupm/commit/63c0bc0a7b07370062f70ba21135690eb1cb7ef9))
* new package com.leopotam.ecs ([444467b](https://github.com/openupm/openupm/commit/444467b8c46602d6b00b9b5ade7ae9eac1e70c16))
* new package com.leopotam.ecs-threads ([51221e6](https://github.com/openupm/openupm/commit/51221e6bf6c11e8cd103c1d4c9ec5f486032617e))
* new package com.leopotam.ecs-types ([80a5e96](https://github.com/openupm/openupm/commit/80a5e969975035a9f42dffc9880b5176dafdc3bd))
* new package com.leopotam.ecs-ui ([75e4766](https://github.com/openupm/openupm/commit/75e4766a3a040f77074454a501975582a4aedab5))
* new package com.leopotam.ecs-unityintegration ([8e9e9ee](https://github.com/openupm/openupm/commit/8e9e9ee3f34714500ac42edac096f12fdfaf21cc))
* new package com.mirrorng.mirrorng ([57a0c5d](https://github.com/openupm/openupm/commit/57a0c5d80c7db1d75974acbf47fb9ddfacefd21a))
* new package com.nanory.nanoecs ([b138590](https://github.com/openupm/openupm/commit/b1385908a426410a0eb9be6b5f33c8ce8aa18339))
* new package com.newtonsoft.json ([173fa52](https://github.com/openupm/openupm/commit/173fa5211cc32f7ec9c6353a5b62a698554fdbf6))
* new package com.nobi.roundedcorners ([30149d3](https://github.com/openupm/openupm/commit/30149d38083201d5ce63b01d46f5debebf410c00))
* new package com.oss.leantween ([4e0a0c5](https://github.com/openupm/openupm/commit/4e0a0c52d3be3c8ad49f17063ba7f4df07babb9d))
* new package com.pixelwizards.naughtyattributes ([afdcff9](https://github.com/openupm/openupm/commit/afdcff96b64eb00aa69801091b714d3575f06530))
* new package com.pixelwizards.utilities ([d4779a9](https://github.com/openupm/openupm/commit/d4779a9cbf931a77772f2b8f6da800c10e2155cd))
* new package com.qfsw.mop2 ([fddff12](https://github.com/openupm/openupm/commit/fddff12628c8a5c51f280992612e0131a3d41787))
* new package com.sebaslab.svelto.common ([bd176e0](https://github.com/openupm/openupm/commit/bd176e039a61cbcbdaf4d9006f99ac2bf18e78a1))
* new package com.sebaslab.svelto.tasks ([b06657c](https://github.com/openupm/openupm/commit/b06657c7cf13f9bad3a2339818fe62c5a747186c))
* new package com.starikcetin.bindingsrx-textmeshpro ([cb7b20e](https://github.com/openupm/openupm/commit/cb7b20ec23afaa1fc93e8bf26894ccd94dff8b99))
* new package com.starikcetin.joy ([31b3b96](https://github.com/openupm/openupm/commit/31b3b9692f6f42599c5e25fe30d6fce89577931a))
* new package com.supyrb.configurableshaders ([2fed34a](https://github.com/openupm/openupm/commit/2fed34a38844912cdeddf3665643d5ad3c416dda))
* new package com.supyrb.signals ([5cdd5a2](https://github.com/openupm/openupm/commit/5cdd5a2b89e099fa0c876fca8946092bcfa01f32))
* new package com.unity.uiextensions ([83e9cd3](https://github.com/openupm/openupm/commit/83e9cd3fc24367db7000786d9b540dad34c4a20e))
* new package com.unity.vfx-toolbox ([0eaeaa1](https://github.com/openupm/openupm/commit/0eaeaa1f43a5597b26e2dbccb254a34829368b9e))
* new package com.xsduan.hierarchy-folders ([8e43c61](https://github.com/openupm/openupm/commit/8e43c61acb223a768f86080da780f2d45ef763ec))
* new package com.yasirkula.ingame-debug-console ([72efb4e](https://github.com/openupm/openupm/commit/72efb4e86f85d339e0bf7390205f73538617e6dd))
* new package dev.monry.unirx-observabletween ([f1900aa](https://github.com/openupm/openupm/commit/f1900aaf6085d22ff3968e3ed9f7ee0e301ebb6b))
* new package dev.monry.upm.eventconnector ([9c915f4](https://github.com/openupm/openupm/commit/9c915f4a46315c9c0d9421507422ad83dd7e6e7e))
* new package dev.monry.zenject-instancebroker ([8b8291f](https://github.com/openupm/openupm/commit/8b8291fb279a5769e803e849ad4d1c402231aaea))
* new package entities-bt ([96b94f0](https://github.com/openupm/openupm/commit/96b94f01c7666d14d2c3c75a7c5336b20dec5e61))
* new package github.siccity.serializable-callback ([ff6cb05](https://github.com/openupm/openupm/commit/ff6cb0555602ab1ed95616f0e93020811b3ba201))
* new package io.github.jonasdem.entityselection ([dee9371](https://github.com/openupm/openupm/commit/dee9371870b46faa7655c27d2c3715a99e58c4a6))
* new package jp.setchi.easingcore ([5ea2396](https://github.com/openupm/openupm/commit/5ea23968c87743176182da82d64aef54db467cc5))
* new package net.roystan.unitytoonshader ([b5a932c](https://github.com/openupm/openupm/commit/b5a932c7516f6b9db62e4b5029e1e735000f585d))
* new package originer ([7585192](https://github.com/openupm/openupm/commit/75851923bbbf0aa212a9ad2020276222f2ed84c9))
* new package type-inspector ([94aeb8d](https://github.com/openupm/openupm/commit/94aeb8df6f3f6e1260b4e88af059e1c5adcbb2a7))
* new package unity-json-rpc ([6355213](https://github.com/openupm/openupm/commit/6355213d9dddb23c540548a5abfac1d5874e77b3))
* new package upm-embed ([f7b73d1](https://github.com/openupm/openupm/commit/f7b73d15eb5259c87e0bfebc834b0e5ab31982ca))
* prefill package data for new file pull request ([942421f](https://github.com/openupm/openupm/commit/942421f127991d380a5018ca8bf126d52ff4bea6))
* semantic-release ([aaf339e](https://github.com/openupm/openupm/commit/aaf339e2a4305d57d7ab387fe665ee79c32145c9))
* **pipelines:** remove failed release that not listed in remote tags ([809cea3](https://github.com/openupm/openupm/commit/809cea3a6f6e58f04f922d210bb173c1b2c31301))
* **website:** detect package.json path ([d6345f1](https://github.com/openupm/openupm/commit/d6345f162085e80bdb2034241469c695097ca744))
* add job remove release ([59ac3dd](https://github.com/openupm/openupm/commit/59ac3ddeb6b3205173d1b6554c8904d3be950d47))
* add package button on navbar ([c50ebe2](https://github.com/openupm/openupm/commit/c50ebe2d16c5258f750498d51f4d2b725e7f193b))
* adding markdown badge ([249f5c0](https://github.com/openupm/openupm/commit/249f5c02593bd0ada2e6eb64cb3a6ac5c933940c))
* badge ([018fbbe](https://github.com/openupm/openupm/commit/018fbbe2ef29e42e0b4f8ad90db248d556c2f609))
* cookie consent and ga ([544211f](https://github.com/openupm/openupm/commit/544211fc6986d05ee9e33a8aaf75907c35450f04))
* improve search result ([5265beb](https://github.com/openupm/openupm/commit/5265bebd1954878f6c28cc7c9cea5fc814a06a20))
* new package com.bastianblokland.componenttask ([d730011](https://github.com/openupm/openupm/commit/d730011db27e32c72e777e7ac7d9e020cea8e4ae))
* new package com.coffee.internal-accessible-compiler ([2f0c0ad](https://github.com/openupm/openupm/commit/2f0c0ad75e468a43c3d4165022147586fd2fb2aa))
* new package com.coffee.open-sesame-compiler ([51c2a6f](https://github.com/openupm/openupm/commit/51c2a6fc0726e9f06242d8d7fb21930c1f0d7204))
* new package com.coffee.softmask-for-ugui ([df0a0e6](https://github.com/openupm/openupm/commit/df0a0e69464d3d1c9de233d2df89067b8675d562))
* new package com.coffee.ui-particle ([0416cab](https://github.com/openupm/openupm/commit/0416cab8352995555d9a12aee1b0486ff87c0dc3))
* new package com.coffee.unmask ([f1b5211](https://github.com/openupm/openupm/commit/f1b52110a309142c09d90c5a486564b5d7462596))
* new package com.danieleverland.scriptableobjectarchitecture ([90adce9](https://github.com/openupm/openupm/commit/90adce92725325ae3104751d5cf2d5baea2b486e))
* new package com.devlab.jmespath ([5ae019c](https://github.com/openupm/openupm/commit/5ae019ce1e0a523c25b6a2c7347fbfa4616efbf5))
* new package com.latios.latiosframework ([155e80e](https://github.com/openupm/openupm/commit/155e80eb816fa5c77e9a792d01e1a88cae8e254d))
* new package com.pixelplacement.itween ([c2353e6](https://github.com/openupm/openupm/commit/c2353e6a3698fc02fe624091aa23834b019715ac))
* new package com.sebaslab.svelto.ecs ([88569bd](https://github.com/openupm/openupm/commit/88569bd55d1ec11814a041320928e017f3662c59))
* new package com.starikcetin.quickplaytool ([1e1534d](https://github.com/openupm/openupm/commit/1e1534d4cc5a4660c7cfc1d0f433aa9aea425f03))
* new package com.syomus.proceduraltoolkit ([6addf18](https://github.com/openupm/openupm/commit/6addf1837fdb002de56d2a3a270847cdf8be32cb))
* new package com.unity.2d.tilemap.extras ([d75d448](https://github.com/openupm/openupm/commit/d75d448803bd944ccfc29b04d56d3df03b72b2a2))
* new package com.unity.project-auditor ([0d89587](https://github.com/openupm/openupm/commit/0d89587ee88a0614932e12b114feb82669b5b365))
* new package com.unity.timeline-tools ([d113588](https://github.com/openupm/openupm/commit/d113588a80f0dfdff1c324f6e575557ea8ae3f8d))
* new package com.xrtk.core ([ec81387](https://github.com/openupm/openupm/commit/ec81387e4c76603ec26c1b7de8aa37b11497a8fd))
* new package com.xrtk.lumin ([6592c0c](https://github.com/openupm/openupm/commit/6592c0cb586a2653998619b706bd5c0820bee9d5))
* new package com.xrtk.oculus ([25b7b28](https://github.com/openupm/openupm/commit/25b7b28dc61cc802b37ac91fcac07884d2e5c98b))
* new package com.xrtk.sdk ([255fb08](https://github.com/openupm/openupm/commit/255fb088cdc574897e4b095d7f40128e73e74bee))
* new package com.xrtk.wmr ([c2a0dcd](https://github.com/openupm/openupm/commit/c2a0dcda8a7c19422e3f5e2ce6597bd63912fa87))
* new package dev.upm-packages.enumflags ([bac62bc](https://github.com/openupm/openupm/commit/bac62bc3750ef488e49fb7de1966acac3a42add4))
* new package dev.upm-packages.extraunityengine ([2ae11e4](https://github.com/openupm/openupm/commit/2ae11e46af4b0b69a09c1a5b04b0fc26aaca39c7))
* new package dev.upm-packages.keyeventhandler ([bd4a020](https://github.com/openupm/openupm/commit/bd4a020ad0bc2f467c91c7d7bda1a081e21130cc))
* new package dev.upm-packages.unirx-observableunitywebrequest ([4c72aae](https://github.com/openupm/openupm/commit/4c72aae3a1c1d01d7409128b8ac05a0c100e9441))
* new package jp.setchi.fancyscrollview ([3cc9947](https://github.com/openupm/openupm/commit/3cc9947b5757fdac67d1831a49b896964df5ef0a))
* new package net.roystan.toonwatershader ([fd9afa9](https://github.com/openupm/openupm/commit/fd9afa9dfde3b8818e7edcd3b74a8c4b3973de32))
* new package net.roystan.unitygrassgeometryshader ([09cf646](https://github.com/openupm/openupm/commit/09cf6463c35d6248b864e3f76c484e2b75c8f7f9))
* new package net.roystan.unityoutlineshader ([7aa3fa5](https://github.com/openupm/openupm/commit/7aa3fa5fa069564910e70d426c95666af9cdf7a6))
* new package net.yasirkula.unitybeziersolution ([e830c6c](https://github.com/openupm/openupm/commit/e830c6c0b53d79a052d08c125ab179dd8bfb8a58))
* pwa ([28d2b65](https://github.com/openupm/openupm/commit/28d2b6519a23d3a6537388891bbb422559c11bbe))
* retire package folder ([09b9695](https://github.com/openupm/openupm/commit/09b9695efcb5e76218fc1953ad94841fb5937d7b))
* seo ([522e247](https://github.com/openupm/openupm/commit/522e247716ec4739cbe94b58b8c0cc7de223a5ce))
* server cli to remove failed releases ([3b5d4d8](https://github.com/openupm/openupm/commit/3b5d4d8bf1938e5500d16cf218734644a1d149f0))
* show avatar on package list and detail ([e02f965](https://github.com/openupm/openupm/commit/e02f9650d3fdb6cb825fbf7918926d6651a57937))
* show fork info on list and detail pages ([c436ae1](https://github.com/openupm/openupm/commit/c436ae13ce216847794bc1fa93359616c0dfdadb))
* show package count on home ([d38d7ad](https://github.com/openupm/openupm/commit/d38d7adb923bca54631b8d13dc7d1722ac00771a))
* show related packages on package detail ([3709bcb](https://github.com/openupm/openupm/commit/3709bcb37721efcc6501c6f5573bb450db9e0cb2))
* show upstream owner as author for forked repo ([3c72567](https://github.com/openupm/openupm/commit/3c72567b0afad4a09d87061b2a51b1e53eed8b37))
* sitemap ([6635c98](https://github.com/openupm/openupm/commit/6635c9878eee7f88ec28ce52006644622f380887))
* social share ([c98c0a2](https://github.com/openupm/openupm/commit/c98c0a287163b689295cef90b0a4ef3ad63c1dd9))
* split version history and build issues in detail page ([1a84109](https://github.com/openupm/openupm/commit/1a84109e1505426d9a484836bbd022a7601a1466))
* use OPENUPM_DEBUG env to control log level ([c8a02fc](https://github.com/openupm/openupm/commit/c8a02fc9628df317c94c10264fdaa788c71ce12a))
