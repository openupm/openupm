/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const fs = require("fs");
const assert = require("assert");
const should = require("should");
const rewire = require("rewire");
const { isString } = require("lodash/lang");
const redis = require("../app/db/redis");
const spdx = require("spdx-license-list");
const {
  loadPackageNames,
  loadPackageSync,
  loadTopics,
  loadBlockedScopes,
  packagesDir,
  isValidPackageName
} = require("../app/utils/package");

const knownInvalidNames = [
  "AtlasImage",
  "ButtonEx",
  "EditorSceneActiveSwitcher",
  "Light2D",
  "SceneHistory",
  "SubAssetEditor",
  "UnityEventDrawerEx",
  "VertexTextureFetchForuGUI",
  "astar.action-grid",
  "astar",
  "autoinjector",
  "baked-inject",
  "bindingrx",
  "caneva20.config-assets",
  "carlos-wilkes.lean",
  "codebundle",
  "com.gameanalytics",
  "com.libnoise",
  "com.linkergenerator",
  "com.linqtogameobject",
  "com.litedb",
  "com.mybox",
  "com.unimob",
  "com.unitycsprojnuget",
  "d4160.constants-and-enums-generator-kit",
  "d4160.data_persistence-helper-system",
  "d4160.game-framework-core",
  "d4160.game-framework",
  "d4160.scene_management-system",
  "d4160.ui-loading_screen-prefabs",
  "elzach.extensions",
  "elzach.leveleditor",
  "entity-inspector-extension",
  "exit-games.photon-unity-sdk",
  "exit-games.photon-voice-2",
  "facepunch.highlight",
  "facepunch.steamworks",
  "jazzbox",
  "judah4.hsvcolorpickerunity",
  "ks.unitydarkenthemer",
  "kybernetik.ult-events",
  "missingunityevents",
  "moonsharp",
  "nothke.astar",
  "nothke.atmosphericscattering",
  "nothke.flycam",
  "nothke.fpscounter",
  "nothke.ndraw",
  "nothke.paths",
  "nothke.pool",
  "nothke.protogui",
  "originer",
  "paps.hierarchical-state-machine",
  "paps.maybe",
  "paps.plain-state-machine",
  "paps.state-machines-core",
  "paps.unity-updater",
  "pixelplacement.surge",
  "play-fab.unity-sdk",
  "remy-unity.crt-texture-packer",
  "rotorz.unity3d-class-type-reference",
  "shitake.rosetta",
  "st.one-line",
  "st.rect-ex",
  "taras-osiris.better-defines",
  "toofusan.twity",
  "type-inspector",
  "uni-git",
  "unienumextension",
  "uninativelinq",
  "unitinium",
  "unity-dynamic-scroll-rect",
  "unity-json-rpc",
  "unity-xr-input-helper-system",
  "uniunsafeio",
  "upm-embed",
  "usfxr",
  "xjine.versionfilebuilder",
  "zenject"
];

describe("data/packages", async function() {
  const packageNames = await loadPackageNames();
  const validTopics = await loadTopics();
  const blockedScopes = await loadBlockedScopes();
  describe("verify packages", function() {
    for (const packageName of packageNames) {
      it("verify format: " + packageName, async function() {
        const pkg = await loadPackageSync(packageName);
        // Check required
        should.exist(pkg, "yaml format should be valid");
        should.exist(pkg.repoUrl, "repoUrl is required");
        should.exist(pkg.name, "name is required");
        const [isNameValid, nameValidError] = isValidPackageName(pkg.name);
        // Ignore known invalid names
        if (!knownInvalidNames.includes(pkg.name)) {
          if (!isNameValid) throw nameValidError;
        }
        should.equal(
          pkg.name,
          packageName,
          "pkg.name should be match with filename[.yml]"
        );
        // Check blocked scopes
        for (let scope of blockedScopes) {
          should.ok(!pkg.name.startsWith(scope), `scope ${scope} is blocked.`);
        }
        // check topics
        if (pkg.topics) {
          if (isString(pkg.topics)) pkg.topics = [pkg.topics];
          for (const topic of pkg.topics) {
            const found = validTopics.find(x => x.slug == topic);
            should.exist(found, `topic ${topic} should be valid`);
          }
        }
        // check license
        if (pkg.licenseSpdxId) {
          should.exist(
            spdx[pkg.licenseSpdxId],
            `licenseSpdxId ${pkg.licenseSpdxId} should be valid. See full IDs at https://raw.githubusercontent.com/sindresorhus/spdx-license-list/master/spdx-simple.json`
          );
        }
        // check image
        if (pkg.image) {
          should.ok(
            /https?:\/\//i.test(pkg.image),
            `image field should be a valid URL.`
          );
        }
      });
    }
  });
  describe("verify packages extention name", function() {
    const files = fs.readdirSync(packagesDir);
    for (const file of files) {
      it("verify extention name: " + file, function() {
        file.should.endWith(".yml");
      });
    }
  });
});
