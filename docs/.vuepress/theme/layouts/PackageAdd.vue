<!-- eslint-disable vue/no-v-html -->
<template>
  <ParentLayout>
    <main class="package-add">
      <div class="mainview container">
        <div class="columns breadcrumbview">
          <div class="column col-12">
            <ul class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="/">{{ $t("home") }}</a>
              </li>
              <li class="breadcrumb-item">
                <a href="/packages/">{{ $t("packages") }}</a>
              </li>
              <li class="breadcrumb-item">
                <a href="#">{{ $t("add-package") }}</a>
              </li>
            </ul>
          </div>
          <div class="column col-12">
            <h1>{{ $t("add-package-title") }}</h1>
          </div>
          <div class="column col-5 col-sm-12">
            <fieldset v-if="!isStepFillFormChecked" :disabled="isSubmitting">
              <div class="columns">
                <div
                  class="form-group column col-12"
                  :class="{ 'has-error': form.repo.error }"
                >
                  <label class="form-label required">{{
                    $t("repository")
                  }}</label>
                  <div class="input-group">
                    <span class="input-group-addon">github.com/</span>
                    <input
                      v-model.trim="form.repo.value"
                      class="form-input"
                      type="text"
                      required
                      :placeholder="$t('repository-placeholder')"
                      @change="onRepoChange"
                    />
                    <button
                      class="btn btn-primary input-group-btn btn-go"
                      @click="onGoClick"
                    >
                      {{ $t("go") }}
                    </button>
                  </div>
                  <span v-if="form.repo.error" class="form-input-hint">
                    {{ form.repo.error }}
                  </span>
                </div>
                <div
                  class="form-group column col-12"
                  :class="{
                    hide: hideOtherFields,
                    'has-error': form.branch.error,
                  }"
                >
                  <label class="form-label required">{{ $t("branch") }}</label>
                  <select
                    v-model="form.branch.value"
                    class="form-select"
                    required
                    @change="onBranchChange($event)"
                  >
                    <option v-if="!branches.length" disabled selected value="">
                      {{ $t("loading-branches") }}
                    </option>
                    <option
                      v-for="branch in branches"
                      :key="branch"
                      :value="branch"
                    >
                      {{ branch }}
                    </option>
                  </select>
                  <span v-if="form.branch.error" class="form-input-hint">
                    {{ form.branch.error }}
                  </span>
                </div>
                <div
                  id="packageJson"
                  class="form-group column col-12"
                  :class="{
                    hide: hideOtherFields || !form.branch.value,
                    'has-error': form.packageJson.error,
                  }"
                >
                  <label class="form-label required">
                    {{ $t("path-of-package-json") }}
                  </label>
                  <select
                    v-model="form.packageJson.value"
                    class="form-select"
                    required
                    @change="onPackageJsonPathChange($event)"
                  >
                    <option
                      v-if="!packageJsonPaths.length"
                      disabled
                      selected
                      value=""
                    >
                      {{ form.packageJson.prompt }}
                    </option>
                    <option
                      v-for="path in packageJsonPaths"
                      :key="path"
                      :value="path"
                    >
                      {{ path }}
                    </option>
                  </select>
                  <span
                    v-if="packageInfo"
                    class="form-input-hint display-block"
                  >
                    {{ packageInfo.name }}
                  </span>
                  <span
                    v-if="extraPackageNameWarning"
                    class="bg-warning display-block"
                  >
                    {{ extraPackageNameWarning() }}
                  </span>
                  <span v-if="form.packageJson.error" class="form-input-hint">
                    {{ form.packageJson.error }}
                  </span>
                </div>
                <div
                  id="readme"
                  class="form-group column col-12"
                  :class="{
                    hide: hideOtherFields || !form.branch.value,
                    'has-error': form.readme.error,
                  }"
                >
                  <label class="form-label">
                    {{ $t("path-of-readme") }}
                  </label>
                  <select v-model="form.readme.value" class="form-select">
                    <option
                      v-if="!readmePaths.length"
                      disabled
                      selected
                      value=""
                    >
                      {{ form.readme.prompt }}
                    </option>
                    <option v-if="readmePaths.length" value="">
                      {{ $t("field-none") }}
                    </option>
                    <option
                      v-for="path in readmePaths"
                      :key="path"
                      :value="path"
                    >
                      {{ path }}
                    </option>
                  </select>
                  <span v-if="form.readme.error" class="form-input-hint">
                    {{ form.readme.error }}
                  </span>
                </div>
                <div
                  class="form-group column col-12"
                  :class="{ hide: hideOtherFields }"
                >
                  <label class="form-label">{{ $t("git-tag-prefix") }}</label>
                  <input
                    v-model="form.gitTagPrefix.value"
                    class="form-input"
                    type="text"
                    :placeholder="$t('git-tag-prefix-placeholder')"
                  />
                  <span
                    class="form-input-hint"
                    v-html="$t('git-tag-prefix-desc-safe')"
                  >
                  </span>
                </div>
                <div
                  class="form-group column col-12"
                  :class="{ hide: hideOtherFields }"
                >
                  <label class="form-label">{{
                    $t("git-tag-ignore-pattern")
                  }}</label>
                  <input
                    v-model="form.gitTagIgnore.value"
                    class="form-input"
                    type="text"
                    :placeholder="$t('git-tag-ignore-pattern-placeholder')"
                  />
                  <span class="form-input-hint">
                    {{ $t("git-tag-ignore-pattern-desc") }}
                    <br />
                    <code v-if="form.gitTagIgnore.value">
                      /{{ form.gitTagIgnore.value }}/i
                    </code>
                  </span>
                </div>
                <div
                  class="form-group column col-12"
                  :class="{ hide: hideOtherFields }"
                >
                  <label class="form-label">{{
                    $t("minimal-version-to-build")
                  }}</label>
                  <input
                    v-model="form.minVersion.value"
                    class="form-input"
                    type="text"
                    :placeholder="$t('minimal-version-to-build-placeholder')"
                  />
                </div>
                <div
                  class="form-group column col-12"
                  :class="{
                    hide: hideLicenseName || hideOtherFields,
                    'has-error': form.licenseName.error,
                  }"
                >
                  <label class="form-label">{{ $t("license-name") }}</label>
                  <input
                    v-model="form.licenseName.value"
                    class="form-input"
                    type="text"
                  />
                  <span class="form-input-hint">
                    {{ $t("license-name-desc") }}
                  </span>
                </div>
                <div
                  class="form-group column col-12"
                  :class="{
                    hide: hideOtherFields,
                    'has-error': form.topics.error,
                  }"
                >
                  <label class="form-label">{{ $t("topics") }}</label>
                  <div class="columns">
                    <div
                      v-for="item in form.topics.options"
                      :key="item.slug"
                      class="column col-6"
                    >
                      <label class="form-checkbox">
                        <input v-model="item.value" type="checkbox" /><i
                          class="form-icon"
                        ></i>
                        {{ $te(item.slug) ? $t(item.slug) : item.name }}
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  v-if="repoImages.length"
                  class="form-group column col-12"
                  :class="{
                    hide: hideOtherFields,
                    'has-error': form.image.error,
                  }"
                >
                  <label class="form-label">{{ $t("featured-image") }}</label>
                  <div class="form-input-hint">
                    {{ $t("featured-image-desc") }}
                    <a
                      href="https://help.github.com/en/github/administering-a-repository/customizing-your-repositorys-social-media-preview"
                      >{{ $t("social-image") }}</a
                    >{{ $t("featured-image-desc-2") }}
                  </div>
                  <div class="columns pkg-img-columns">
                    <div
                      v-for="item in repoImages"
                      :key="item"
                      class="column col-3"
                    >
                      <div
                        :class="{
                          'pkg-img-wrap': true,
                          selected: form.image.value == item,
                        }"
                        @click="onSelectImage(item)"
                      >
                        <LazyImage :src="item" class="img-responsive pkg-img" />
                      </div>
                    </div>
                  </div>
                  <span v-if="form.image.error" class="form-input-hint">
                    {{ form.image.error }}
                  </span>
                </div>
                <div
                  class="form-group column col-12"
                  :class="{ hide: hideOtherFields }"
                >
                  <label class="form-label">{{ $t("discovered-by") }}</label>
                  <div class="input-group">
                    <span class="input-group-addon">github.com/</span>
                    <input
                      v-model="form.hunter.value"
                      class="form-input"
                      type="text"
                      :placeholder="$t('discovered-by-placeholder')"
                    />
                  </div>
                </div>
                <div
                  class="col-12 form-zone"
                  :class="{
                    hide: hideOtherFields || !form.branch.value,
                  }"
                >
                  <div class="container">
                    <div class="columns">
                      <div class="column col-12">
                        <h5>
                          {{ $t("china-region-info") }}
                        </h5>
                        <span class="form-input-hint">
                          {{ $t("china-region-desc") }}
                        </span>
                      </div>
                      <div id="readme_zhCN" class="form-group column col-12">
                        <label class="form-label">
                          {{ $t("path-of-readme-zhcn") }}
                        </label>
                        <select
                          v-model="form.readme_zhCN.value"
                          class="form-select"
                        >
                          <option
                            v-if="!readmePaths.length"
                            disabled
                            selected
                            value=""
                          >
                            {{ form.readme.prompt }}
                          </option>
                          <option v-if="readmePaths.length" value="">
                            {{ $t("field-none") }}
                          </option>
                          <option
                            v-for="path in readmePaths"
                            :key="path"
                            :value="path"
                          >
                            {{ path }}
                          </option>
                        </select>
                        <span
                          v-if="form.readme_zhCN.error"
                          class="form-input-hint"
                        >
                          {{ form.readme_zhCN.error }}
                        </span>
                      </div>
                      <div
                        class="form-group column col-12"
                        :class="{
                          'has-error': form.displayName_zhCN.error,
                        }"
                      >
                        <label class="form-label">{{
                          $t("display-name-zhcn")
                        }}</label>
                        <input
                          v-model="form.displayName_zhCN.value"
                          class="form-input"
                          type="text"
                        />
                        <span
                          v-if="packageInfo.displayName"
                          class="form-input-hint"
                        >
                          {{ $t("english-text") }} {{ packageInfo.displayName }}
                        </span>
                      </div>
                      <div
                        class="form-group column col-12"
                        :class="{
                          'has-error': form.description_zhCN.error,
                        }"
                      >
                        <label class="form-label">{{
                          $t("description-zhcn")
                        }}</label>
                        <input
                          v-model="form.description_zhCN.value"
                          class="form-input"
                          type="text"
                        />
                        <span
                          v-if="packageInfo.description"
                          class="form-input-hint"
                        >
                          {{ $t("english-text") }} {{ packageInfo.description }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="form-group column col-12 text-right"
                  :class="{ hide: hideOtherFields }"
                >
                  <button
                    class="btn btn-primary btn-submit"
                    @click="onVerifyClick"
                  >
                    {{ $t("verify-package") }}
                  </button>
                </div>
              </div>
            </fieldset>
            <div v-else>
              <h6>{{ $t("package-name") }}: {{ packageInfo.name }}</h6>
              <h6>{{ $t("meta-data") }}:</h6>
              <pre class="code file-content" data-lang="yaml">
                <code>{{ yaml }}</code>
              </pre>
              <div class="text-right">
                <button class="btn btn-error" @click="onBack">
                  {{ $t("back") }}
                </button>
                <a
                  :href="uploadLink.link"
                  class="btn btn-primary"
                  target="_blank"
                  @click="onUpload"
                  >{{ uploadLink.text }}</a
                >
              </div>
            </div>
          </div>
          <div class="column col-7 col-sm-12">
            <div class="how-to-section container">
              <div class="columns">
                <section class="col-12">
                  <div class="timeline">
                    <div class="timeline-item">
                      <div class="timeline-left">
                        <a
                          class="timeline-icon"
                          :class="{ 'icon-lg': isStepFillFormChecked }"
                          href="#"
                        >
                          <i
                            v-if="isStepFillFormChecked"
                            class="icon icon-check"
                          ></i>
                        </a>
                      </div>
                      <div class="timeline-content">
                        <div class="tile">
                          <div class="tile-content">
                            <p class="tile-title">
                              {{ $t("fill-the-package-form") }}
                            </p>
                            <p class="tile-subtitle">
                              {{ $t("fill-the-package-form-desc") }}
                              <NavLink :item="docLink" />.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="isStepFillFormChecked" class="timeline-item">
                      <div class="timeline-left">
                        <a
                          class="timeline-icon"
                          :class="{ 'icon-lg': isStepGetYamlFileChecked }"
                          href="#"
                        >
                          <i
                            v-if="isStepGetYamlFileChecked"
                            class="icon icon-check"
                          ></i>
                        </a>
                      </div>
                      <div class="timeline-content">
                        <div class="tile">
                          <div class="tile-content">
                            <p class="tile-title">
                              {{ $t("upload-to-github-via-pr") }}
                            </p>
                            <p class="tile-subtitle">
                              {{ $t("upload-to-github-via-pr-desc") }}
                            </p>
                            <ul>
                              <li
                                v-html="
                                  $t('upload-to-github-via-pr-step-1-safe')
                                "
                              ></li>
                              <li
                                v-html="
                                  $t('upload-to-github-via-pr-step-2-safe')
                                "
                              ></li>
                              <li
                                v-html="
                                  $t('upload-to-github-via-pr-step-3-safe')
                                "
                              ></li>
                              <li
                                v-html="
                                  $t('upload-to-github-via-pr-step-4-safe')
                                "
                              ></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="isStepFillFormChecked" class="timeline-item">
                      <div class="timeline-left">
                        <a
                          class="timeline-icon"
                          :class="{ 'icon-lg': isStepCIChecked }"
                          href="#"
                        >
                          <i v-if="isStepCIChecked" class="icon icon-check"></i>
                        </a>
                      </div>
                      <div class="timeline-content">
                        <div class="tile">
                          <div class="tile-content">
                            <p class="tile-title">
                              {{ $t("wait-for-ci-pipelines") }}
                            </p>
                            <ul>
                              <li>
                                <span
                                  v-html="
                                    $t('wait-for-ci-pipelines-step-1-safe')
                                  "
                                ></span>
                                <NavLink :item="packageLink" target="_blank" />
                              </li>
                              <li
                                v-html="$t('wait-for-ci-pipelines-step-2-safe')"
                              ></li>
                              <li
                                v-html="$t('wait-for-ci-pipelines-step-3-safe')"
                              ></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Content class="theme-default-content custom" />
    </main>
  </ParentLayout>
</template>

<script>
import axios from "axios";
import Enum from "enum";
import querystring from "querystring";
import VueScrollTo from "vue-scrollto";
import spdx from "spdx-license-list";
import urljoin from "url-join";
import yaml from "js-yaml";

import NavLink from "@theme/components/NavLink.vue";
import ParentLayout from "@theme/layouts/Layout.vue";
import util from "@root/docs/.vuepress/util";
import commonUtils from "@root/app/common/utils";

const SubmitStep = new Enum({
  FillForm: 0,
  GetYamlFile: 1,
  CI: 2,
});

export default {
  components: { ParentLayout, NavLink },
  data() {
    return {
      isSubmitting: false,
      step: 0,
      form: {
        branch: {
          error: "",
          value: "",
        },
        displayName_zhCN: {
          error: "",
          value: "",
        },
        description_zhCN: {
          error: "",
          value: "",
        },
        gitTagPrefix: {
          error: "",
          value: "",
        },
        gitTagIgnore: {
          error: "",
          value: "",
        },
        hunter: {
          error: "",
          value: "",
        },
        licenseId: {
          error: "",
          value: null,
        },
        licenseName: {
          error: "",
          value: "",
        },
        minVersion: {
          error: "",
          value: "",
        },
        readme: {
          error: "",
          value: null,
        },
        readme_zhCN: {
          error: "",
          value: null,
        },
        image: {
          error: "",
          value: null,
        },
        packageJson: {
          prompt: "",
          error: "",
          value: "",
        },
        repo: {
          error: "",
          value: "",
        },
        topics: {
          error: "",
          options: [],
        },
      },
      hideOtherFields: true,
      repoInfo: {},
      repoImages: [],
      packageJsonPaths: {},
      packageInfo: {},
      readmePaths: {},
      branches: [],
      yaml: "",
      yamlFilename: "",
    };
  },
  computed: {
    blockedScopes() {
      return this.$page.frontmatter.blockedScopes;
    },
    licenses() {
      return this.$page.frontmatter.licenses;
    },
    hideLicenseName() {
      return Boolean(this.$data.form.licenseId.value);
    },
    isStepFillFormChecked() {
      return this.$data.step > SubmitStep.FillForm.value;
    },
    isStepGetYamlFileChecked() {
      return this.$data.step > SubmitStep.GetYamlFile.value;
    },
    isStepCIChecked() {
      return this.$data.step > SubmitStep.CI.value;
    },
    uploadLink() {
      const qs = querystring.stringify({
        filename: "data/packages/" + this.$data.yamlFilename,
        value: this.$data.yaml,
        message: `chore(data): new package ${this.$data.packageInfo.name}`,
      });
      return {
        link: "https://github.com/openupm/openupm/new/master/?" + qs,
        text: this.$t("submit-pr"),
      };
    },
    docLink() {
      return {
        link: "/docs/adding-upm-package",
        text: "docs/adding-upm-package",
      };
    },
    packageLink() {
      return {
        link: "/packages/" + this.$data.packageInfo.name,
        text: "/packages/" + this.$data.packageInfo.name,
      };
    },
  },
  mounted() {
    let topics = this.$page.frontmatter.topics;
    this.$data.form.topics.options = topics.map(function (x) {
      return {
        name: x.name,
        slug: x.slug,
        value: false,
      };
    });
  },
  methods: {
    onRepoChange() {
      // Cleanify repo
      let repo = this.$data.form.repo.value;
      this.$data.form.repo.value = repo
        .replace(/^\//i, "")
        .replace(/https:\/\/github\.com\//i, "")
        .replace(/\.git$/i, "")
        .replace(/\/$/i, "");
      this.$data.hideOtherFields = true;
      this.$data.step = SubmitStep.FillForm.value;
    },
    onBranchChange() {
      this.fetchGitTrees();
    },
    onPackageJsonPathChange() {
      if (this.form.packageJson.value) {
        this.fetchPackageInfo();
      }
    },
    onGoClick() {
      let repo = this.$data.form.repo.value;
      if (repo) {
        this.$data.isSubmitting = true;
        this.$data.step = SubmitStep.FillForm.value;
        this.fetchRepoInfo();
        this.fetchBranches();
        this.fetchRepoImage();
      }
    },
    onSelectImage(item) {
      if (this.$data.form.image.value != item)
        this.$data.form.image.value = item;
      else this.$data.form.image.value = null;
    },
    onVerifyClick() {
      this.verifyPackage();
    },
    onBack() {
      this.$data.step = SubmitStep.FillForm;
      this.$data.hideOtherFields = true;
    },
    onUpload() {
      this.$data.step = SubmitStep.CI;
    },
    genYaml() {
      let form = this.$data.form;
      let repoInfo = this.$data.repoInfo;
      let packageInfo = this.$data.packageInfo;
      let content = {
        name: packageInfo.name,
        displayName: packageInfo.displayName || "",
        description: packageInfo.description || repoInfo.description || "",
        repoUrl: repoInfo.html_url,
        parentRepoUrl: repoInfo.parent ? repoInfo.parent.html_url : null,
        licenseSpdxId: form.licenseId.value,
        licenseName: form.licenseName.value,
        topics: form.topics.options.filter((x) => x.value).map((x) => x.slug),
        hunter: form.hunter.value,
        gitTagPrefix: form.gitTagPrefix.value,
        gitTagIgnore: form.gitTagIgnore.value,
        minVersion: form.minVersion.value,
        image: form.image.value,
        readme: form.readme.value
          ? form.branch.value + ":" + form.readme.value
          : "master:README.md",
        readme_zhCN: form.readme_zhCN.value
          ? form.branch.value + ":" + form.readme_zhCN.value
          : "",
        displayName_zhCN: form.displayName_zhCN.value,
        description_zhCN: form.description_zhCN.value,
        createdAt: new Date().getTime(),
      };
      return yaml.safeDump(content);
    },
    guessLicenseId() {
      if (this.form.licenseName.value && !this.form.licenseId.value) {
        const spdxId = Object.keys(spdx).find(
          (x) =>
            spdx[x].name == this.form.licenseName.value ||
            x == this.form.licenseName.value
        );
        if (spdxId) {
          this.form.licenseId.value = spdxId;
          this.form.licenseName.value = spdx[this.form.licenseId.value].name;
        }
      }
    },
    resetFormError() {
      let form = this.$data.form;
      for (let key in form) {
        let element = form[key];
        if (element !== null && "error" in element) element.error = "";
      }
    },
    async fetchRepoInfo() {
      try {
        // Clean error message.
        this.resetFormError();
        // Fetch.
        let resp = await axios.get(
          urljoin(util.githubReposApiUrl, this.form.repo.value),
          {
            headers: { Accept: "application/vnd.github.v3.json" },
          }
        );
        // Show all fields.
        this.$data.hideOtherFields = false;
        // Assign data.
        let repoInfo = resp.data;
        this.$data.repoInfo = repoInfo;
        if (
          repoInfo.license &&
          repoInfo.license.spdx_id != "NOASSERTION" &&
          repoInfo.license.key != "other"
        ) {
          this.$data.form.licenseId.value = repoInfo.license.spdx_id;
          this.$data.form.licenseName.value = repoInfo.license.name;
        }
      } catch (error) {
        if (error.message.includes("404"))
          this.$data.form.repo.error = "Repository not found";
        else this.$data.form.repo.error = error.message;
      } finally {
        this.$data.isSubmitting = false;
      }
    },
    async fetchRepoImage() {
      try {
        // Clean error message.
        this.$data.form.image.error = "";
        // Fetch.
        let resp = await axios.get(
          util.githubSearchCodeApiUrl +
            `?sort=indexed&q=extension:png+extension:jpg+extension:jpeg+extension:gif+repo:${this.form.repo.value}`,
          {
            headers: { Accept: "application/vnd.github.v3.json" },
          }
        );
        // Assign data.
        const repoImages =
          resp.data && resp.data.items
            ? resp.data.items.map((x) => util.convertToGitHubRawUrl(x.html_url))
            : [];
        this.$data.repoImages = repoImages.slice(0, 100);
      } catch (error) {
        this.$data.form.image.error = error.message;
      }
    },
    async fetchBranches() {
      try {
        // Clean error message.
        this.$data.form.branch.error = "";
        // Fetch.
        let resp = await axios.get(
          urljoin(util.githubReposApiUrl, this.form.repo.value, "branches"),
          {
            headers: { Accept: "application/vnd.github.v3.json" },
          }
        );
        // Assign data.
        let branches = resp.data
          .map((x) => x.name)
          .filter((x) => !x.startsWith("all-contributors/"));
        this.$data.branches = branches;
        if (branches.includes("master")) {
          this.$data.form.branch.value = "master";
          this.onBranchChange();
        }
      } catch (error) {
        this.$data.form.branch.error = error.message;
      }
    },
    async fetchGitTrees() {
      if (!this.form.branch.value) return;
      try {
        // Clean error message.
        this.$data.form.packageJson.error = "";
        this.$data.form.readme.error = "";
        // Fetch.
        const url = urljoin(
          util.githubReposApiUrl,
          this.form.repo.value,
          "git/trees",
          this.form.branch.value
        );
        this.$data.form.packageJson.prompt = "Loading package.json path...";
        this.$data.form.readme.prompt = "Loading README.md path...";
        const resp = await axios.get(url, {
          params: { recursive: 1 },
          headers: { Accept: "application/vnd.github.v3.json" },
        });
        // Assign data to packageJson
        const self = this;
        (function () {
          const paths = resp.data.tree
            .map((x) => x.path)
            .filter((x) => x.endsWith("package.json"));
          self.$data.packageJsonPaths = paths;
          self.$data.form.packageJson.value = null;
          if (paths.length == 0) {
            self.$data.form.packageJson.prompt = "";
            self.$data.form.packageJson.error =
              "File not found: package.json. Please choice a different branch.";
          } else if (paths.length == 1) {
            self.$data.form.packageJson.value = paths[0];
          } else if (paths.includes("package.json")) {
            self.$data.form.packageJson.value = "package.json";
          }
          if (self.$data.form.packageJson.value) {
            self.onPackageJsonPathChange();
          }
        })();
        // Assign data to readme
        (function () {
          const markdownRe = /.(md|markdown)$/i;
          const paths = resp.data.tree
            .map((x) => x.path)
            .filter((x) => markdownRe.test(x));
          self.$data.readmePaths = paths;
          if (paths.length == 0) {
            self.$data.form.readme.prompt = "";
            self.$data.form.readme.error =
              "No markdown file found, will fallback to README.md";
          } else if (paths.length == 1) {
            self.$data.form.readme.value = paths[0];
          } else if (paths.includes("README.md")) {
            self.$data.form.readme.value = "README.md";
          } else {
            const filteredPath = paths.filter((x) => x.endsWith("README.md"));
            if (filteredPath.length > 0) {
              self.$data.form.readme.value = filteredPath[0];
            }
          }
        })();
      } catch (error) {
        this.$data.form.packageJson.error = error.message;
      }
    },
    async fetchPackageInfo() {
      try {
        // Clean error message.
        this.$data.form.packageJson.error = "";
        // Fetch.
        let url = urljoin(
          util.githubReposApiUrl,
          this.form.repo.value,
          "contents",
          this.form.packageJson.value,
          "?ref=" + this.$data.form.branch.value
        );
        let resp = await axios.get(url, {
          headers: { Accept: "application/vnd.github.v3.json" },
        });
        // Assign data.
        let content = atob(resp.data.content);
        this.$data.packageInfo = JSON.parse(content);
        let packageName = this.$data.packageInfo.name;
        // Verify private
        if (this.$data.packageInfo.private)
          throw new Error(
            'Refuse to publish a private repository ("private": true in the package.json).'
          );
        // Verify blocked scopes
        for (const blockedScope of this.blockedScopes) {
          if (packageName.startsWith(blockedScope))
            throw new Error(
              `The package name is blocked by scope ${blockedScope}.`
            );
        }
        // Verify package existence
        if (this.$page.frontmatter.packageNames.includes(packageName))
          throw new Error("The package name already exists.");
        // Verify package naming
        commonUtils.validPackageName(packageName);
        // License
        if (
          this.$data.packageInfo.license &&
          !this.$data.form.licenseName.value
        ) {
          this.$data.form.licenseName.value = this.$data.packageInfo.license;
        }
        // Verify unity registry
        // Unity registry didn't enable the cross origin requests, then the check cannot be done in a browser.
        // await this.verifyPackageExistInUnityRegistry(packageName);
      } catch (error) {
        VueScrollTo.scrollTo("#packageJson", 500, { offset: -80 });
        if (error.message.includes("404"))
          this.$data.form.packageJson.error = "File not found: package.json.";
        else this.$data.form.packageJson.error = error.message;
      }
    },
    async verifyPackageExistInUnityRegistry(packageName) {
      try {
        let url = urljoin(util.unityRegistryUrl, packageName);
        let resp = await axios.get(url);
        throw new Error(this.$t('package-already-exists-in-unity-registry'));
      } catch (error) {}
    },
    async verifyPackage() {
      if (!this.$data.form.packageJson.value) {
        this.$data.form.packageJson.error =
          "Please select the package.json path.";
      }
      if (this.$data.form.packageJson.error) {
        VueScrollTo.scrollTo("#packageJson", 500, { offset: -80 });
        return;
      }
      // Guess license id.
      this.guessLicenseId();
      // Next step.
      this.$data.step = SubmitStep.GetYamlFile.value;
      // Generate YAML.
      this.$data.yaml = this.genYaml();
      this.$data.yamlFilename = this.$data.packageInfo.name + ".yml";
    },
    extraPackageNameWarning() {
      const pkgName = this.$data.packageInfo.name;
      if (pkgName) {
        if (pkgName.toLowerCase().startsWith("com.unity."))
          return this.$t("package-name-com-unity");
        else if (pkgName.toLowerCase().includes("unity"))
          return this.$t("package-name-contains-unity");
      }
    },
  },
};
</script>

<style lang="stylus">
.package-add {
  .mainview {
    margin-top: 1rem;

    .btn-go {
      width: 3rem;
    }

    // #select-repo-source
    // flex 0 1
    .pkg-img-columns {
      padding-top: 0.6rem;

      .pkg-img-wrap {
        position: relative;
        overflow: hidden;
        padding-bottom: 100%;
        border: 2px solid white;

        &.selected {
          border-color: $accentColor;
        }

        &:hover {
          cursor: pointer;
        }

        .pkg-img {
          position: absolute;
          max-width: 100%;
          max-height: 100%;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      }
    }

    .theme-default-content {
      max-width: auto;
      margin: 0;
      padding: 0 0 2.5rem;

      :first-child {
        margin-top: 0;
      }
    }

    .how-to-section {
      padding-left: 0.5rem;

      .timeline-content {
        ol {
          list-style: decimal outside;
        }
      }
    }

    .tile-title {
      font-weight: bold;
    }

    .form-label, .form-input-hint, .form-group, .form-group input, .form-group select, .tile {
      font-size: $fontSizeMD;
    }

    .form-group:last-child {
      margin-bottom: 0.4rem;
    }

    .timeline {
      .timeline-item {
        margin-bottom: 0;
      }
    }

    .form-zone {
      margin: 0.4rem;
      background: #eee;

      h5 {
        margin-top: 0.4rem;
      }
    }
  }
}
</style>
