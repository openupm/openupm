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
                <form novalidate @submit.prevent="onValidateForm">
                  <div
                    id="id_repo"
                    class="form-group column col-12"
                    :class="{ 'has-error': form.errors.repo }"
                  >
                    <label class="form-label required">{{
                      $t("repository")
                    }}</label>
                    <div class="input-group">
                      <span class="input-group-addon">github.com/</span>
                      <input
                        v-model.trim="form.values.repo"
                        class="form-input"
                        type="text"
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
                    <div v-if="form.errors.repo" class="form-input-hint">
                      {{ form.errors.repo }}
                    </div>
                  </div>
                  <div
                    class="col-12 form-zone"
                    :class="{
                      hide: hideOtherFields,
                    }"
                  >
                    <h5 class="text-primary bg-secondary">{{ $t("basic") }}</h5>
                    <div
                      id="id_branch"
                      class="form-group column col-12"
                      :class="{
                        hide: hideOtherFields,
                        'has-error': form.errors.branch,
                      }"
                    >
                      <label class="form-label required">{{
                        $t("branch")
                      }}</label>
                      <select
                        v-model="form.values.branch"
                        class="form-select"
                        @change="onBranchChange($event)"
                      >
                        <option
                          v-if="!branches.length"
                          disabled
                          selected
                          value=""
                        >
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
                      <div v-if="form.errors.branch" class="form-input-hint">
                        {{ form.errors.branch }}
                      </div>
                    </div>
                    <div
                      id="id_packageJson"
                      class="form-group column col-12"
                      :class="{
                        hide: hideOtherFields || !form.values.branch,
                        'has-error': form.errors.packageJson,
                      }"
                    >
                      <label class="form-label required">
                        {{ $t("path-of-package-json") }}
                      </label>
                      <select
                        v-model="form.values.packageJson"
                        class="form-select"
                        @change="onPackageJsonPathChange($event)"
                      >
                        <option
                          v-if="!packageJsonPaths.length"
                          disabled
                          selected
                          value=""
                        >
                          {{ form.prompts.packageJson }}
                        </option>
                        <option
                          v-for="path in packageJsonPaths"
                          :key="path"
                          :value="path"
                        >
                          {{ path }}
                        </option>
                      </select>
                      <div
                        v-if="packageInfo"
                        class="form-input-hint display-block"
                      >
                        package name: <code>{{ packageInfo.name }}</code>
                      </div>
                      <div
                        v-if="extraPackageNameWarning"
                        class="bg-warning display-block"
                      >
                        {{ extraPackageNameWarning() }}
                      </div>
                      <div
                        v-if="form.errors.packageJson"
                        class="form-input-hint"
                      >
                        {{ form.errors.packageJson }}
                      </div>
                    </div>
                    <div
                      id="id_readme"
                      class="form-group column col-12"
                      :class="{
                        hide: hideOtherFields || !form.values.branch,
                        'has-error': form.errors.readme,
                      }"
                    >
                      <label class="form-label">
                        {{ $t("path-of-readme") }}
                      </label>
                      <select v-model="form.values.readme" class="form-select">
                        <option
                          v-if="!readmePaths.length"
                          disabled
                          selected
                          value=""
                        >
                          {{ form.prompts.readme }}
                        </option>
                        <option
                          v-for="path in readmePaths"
                          :key="path"
                          :value="path"
                        >
                          {{ path }}
                        </option>
                      </select>
                      <div v-if="form.errors.readme" class="form-input-hint">
                        {{ form.errors.readme }}
                      </div>
                    </div>
                    <div
                      id="id_licenseName"
                      class="form-group column col-12"
                      :class="{
                        hide: hideOtherFields,
                        'has-error': form.errors.licenseName,
                      }"
                    >
                      <label class="form-label required">{{
                        $t("license-name")
                      }}</label>
                      <input
                        v-model="form.values.licenseName"
                        class="form-input"
                        type="text"
                      />
                      <div class="form-input-hint">
                        {{ $t("license-name-desc") }}
                      </div>
                      <div
                        v-if="form.errors.licenseName"
                        class="form-input-hint"
                      >
                        {{ form.errors.licenseName }}
                      </div>
                    </div>
                    <div
                      id="id_hunter"
                      class="form-group column col-12"
                      :class="{
                        hide: hideOtherFields,
                        'has-error': form.errors.hunter,
                      }"
                    >
                      <label class="form-label required">{{
                        $t("discovered-by")
                      }}</label>
                      <div class="input-group">
                        <span class="input-group-addon">github.com/</span>
                        <input
                          v-model="form.values.hunter"
                          class="form-input"
                          type="text"
                          :placeholder="$t('discovered-by-placeholder')"
                        />
                      </div>
                      <div class="form-input-hint">
                        {{ $t("your-github-username") }}
                      </div>
                      <div v-if="form.errors.hunter" class="form-input-hint">
                        {{ form.errors.hunter }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="col-12 form-zone"
                    :class="{
                      hide: hideOtherFields,
                    }"
                  >
                    <h5 class="text-primary bg-secondary">
                      {{ $t("advanced") }}
                    </h5>
                    <div
                      id="id_gitTagPrefix"
                      class="form-group column col-12"
                      :class="{ hide: hideOtherFields }"
                    >
                      <label class="form-label">{{
                        $t("git-tag-prefix")
                      }}</label>
                      <input
                        v-model="form.values.gitTagPrefix"
                        class="form-input"
                        type="text"
                        :placeholder="$t('git-tag-prefix-placeholder')"
                      />
                      <div
                        class="form-input-hint"
                        v-html="$t('git-tag-prefix-desc-html')"
                      ></div>
                      <div
                        v-if="form.errors.gitTagPrefix"
                        class="form-input-hint"
                      >
                        {{ form.errors.gitTagPrefix }}
                      </div>
                    </div>
                    <div
                      id="id_gitTagIgnore"
                      class="form-group column col-12"
                      :class="{ hide: hideOtherFields }"
                    >
                      <label class="form-label">{{
                        $t("git-tag-ignore-pattern")
                      }}</label>
                      <input
                        v-model="form.values.gitTagIgnore"
                        class="form-input"
                        type="text"
                        :placeholder="$t('git-tag-ignore-pattern-placeholder')"
                      />
                      <div class="form-input-hint">
                        {{ $t("git-tag-ignore-pattern-desc") }}
                        <br />
                        <code v-if="form.values.gitTagIgnore">
                          /{{ form.values.gitTagIgnore }}/i
                        </code>
                      </div>
                      <div
                        v-if="form.errors.gitTagIgnore"
                        class="form-input-hint"
                      >
                        {{ form.errors.gitTagIgnore }}
                      </div>
                    </div>
                    <div
                      id="id_minVersion"
                      class="form-group column col-12"
                      :class="{ hide: hideOtherFields }"
                    >
                      <label class="form-label">{{
                        $t("minimal-version-to-build")
                      }}</label>
                      <input
                        v-model="form.values.minVersion"
                        class="form-input"
                        type="text"
                        :placeholder="
                          $t('minimal-version-to-build-placeholder')
                        "
                      />
                      <div
                        v-if="form.errors.minVersion"
                        class="form-input-hint"
                      >
                        {{ form.errors.minVersion }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="col-12 form-zone"
                    :class="{
                      hide: hideOtherFields,
                    }"
                  >
                    <h5 class="text-primary bg-secondary">
                      {{ $t("promote") }}
                    </h5>
                    <div
                      id="id_topics"
                      class="form-group column col-12"
                      :class="{
                        hide: hideOtherFields,
                        'has-error': form.errors.topics,
                      }"
                    >
                      <label class="form-label required">{{
                        $t("topics")
                      }}</label>
                      <div class="columns">
                        <div
                          v-for="item in form.options.topics"
                          :key="item.slug"
                          class="column col-6"
                        >
                          <label class="form-checkbox">
                            <input
                              v-model="item.value"
                              type="checkbox"
                              @change="onTopicsChange"
                            /><i class="form-icon"></i>
                            {{ $te(item.slug) ? $t(item.slug) : item.name }}
                          </label>
                        </div>
                        <div v-if="form.errors.topics" class="form-input-hint">
                          {{ form.errors.topics }}
                        </div>
                      </div>
                    </div>
                    <div
                      id="id_image"
                      v-if="repoImages.length"
                      class="form-group column col-12"
                      :class="{
                        hide: hideOtherFields,
                        'has-error': form.errors.image,
                      }"
                    >
                      <label class="form-label">{{
                        $t("featured-image")
                      }}</label>
                      <div class="columns pkg-img-columns">
                        <div
                          v-for="item in repoImages"
                          :key="item"
                          class="column col-3"
                        >
                          <div
                            :class="{
                              'pkg-img-wrap': true,
                              selected: form.values.image == item,
                            }"
                            @click="onSelectImage(item)"
                          >
                            <LazyImage
                              :src="item"
                              class="img-responsive pkg-img"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-input-hint">
                        {{ $t("featured-image-desc") }}
                        <NavLink :item="gitHubSocialImageLink" />.
                      </div>
                      <div v-if="form.errors.image" class="form-input-hint">
                        {{ form.errors.image }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="col-12 form-zone"
                    :class="{
                      hide: hideOtherFields || !form.values.branch,
                    }"
                  >
                    <h5 class="text-primary bg-secondary">
                      {{ $t("china-region-info") }}
                    </h5>
                    <div class="container">
                      <div class="columns">
                        <div class="column col-12">
                          <div class="form-input-hint">
                            {{ $t("china-region-desc") }}
                          </div>
                        </div>
                        <div
                          id="id_readme_zhCN"
                          class="form-group column col-12"
                        >
                          <label class="form-label">
                            {{ $t("path-of-readme-zhcn") }}
                          </label>
                          <select
                            v-model="form.values.readme_zhCN"
                            class="form-select"
                          >
                            <option
                              v-if="!readmePaths.length"
                              disabled
                              selected
                              value=""
                            >
                              {{ form.prompts.readme }}
                            </option>
                            <option v-if="readmePaths.length" value=""></option>
                            <option
                              v-for="path in readmePaths"
                              :key="path"
                              :value="path"
                            >
                              {{ path }}
                            </option>
                          </select>
                          <div
                            v-if="form.errors.readme_zhCN"
                            class="form-input-hint"
                          >
                            {{ form.errors.readme_zhCN }}
                          </div>
                        </div>
                        <div
                          id="id_displayName_zhCN"
                          class="form-group column col-12"
                          :class="{
                            'has-error': form.errors.displayName_zhCN,
                          }"
                        >
                          <label class="form-label">{{
                            $t("display-name-zhcn")
                          }}</label>
                          <input
                            v-model="form.values.displayName_zhCN"
                            class="form-input"
                            type="text"
                          />
                          <div
                            v-if="packageInfo.displayName"
                            class="form-input-hint"
                          >
                            {{ $t("english-text") }}
                            {{ packageInfo.displayName }}
                          </div>
                          <div
                            v-if="form.errors.displayName_zhCN"
                            class="form-input-hint"
                          >
                            {{ form.errors.displayName_zhCN }}
                          </div>
                        </div>
                        <div
                          id="id_description_zhCN"
                          class="form-group column col-12"
                          :class="{
                            'has-error': form.errors.description_zhCN,
                          }"
                        >
                          <label class="form-label">{{
                            $t("description-zhcn")
                          }}</label>
                          <input
                            v-model="form.values.description_zhCN"
                            class="form-input"
                            type="text"
                          />
                          <div
                            v-if="packageInfo.description"
                            class="form-input-hint"
                          >
                            {{ $t("english-text") }}
                            {{ packageInfo.description }}
                          </div>
                          <div
                            v-if="form.errors.description_zhCN"
                            class="form-input-hint"
                          >
                            {{ form.errors.description_zhCN }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="form-group column col-12 text-right"
                    :class="{ hide: hideOtherFields }"
                  >
                    <button class="btn btn-primary btn-submit" type="submit">
                      {{ $t("verify-package") }}
                    </button>
                  </div>
                </form>
              </div>
            </fieldset>
            <div v-else>
              <h6>{{ $t("package-name") }}: {{ packageInfo.name }}</h6>
              <h6>{{ $t("meta-data") }}:</h6>
              <pre class="code file-content" data-lang="yaml">
                <code>{{ yaml }}</code>
              </pre>
              <div class="text-right">
                <button class="btn btn-secondary" @click="onBack">
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
                                  $t('upload-to-github-via-pr-step-1-html')
                                "
                              ></li>
                              <li>
                                <span
                                  v-html="
                                    $t('upload-to-github-via-pr-step-2-html')
                                  "
                                ></span>
                                <NavLink :item="gitHubHowToCreatePRLink" />.
                              </li>
                              <li>
                                <span
                                  v-html="
                                    $t('upload-to-github-via-pr-step-3-html')
                                  "
                                ></span>
                                <NavLink :item="gitHubSecurityLink" />.
                              </li>
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
                                    $t('wait-for-ci-pipelines-step-1-html')
                                  "
                                ></span>
                                <NavLink :item="packageLink" target="_blank" />.
                              </li>
                              <li>
                                <span
                                  v-html="
                                    $t('wait-for-ci-pipelines-step-2-html')
                                  "
                                >
                                </span>

                                <NavLink :item="sponsorLink" />.
                              </li>
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
import Joi from "joi";
import querystring from "querystring";
import spdx from "spdx-license-list";
import urljoin from "url-join";
import VueScrollTo from "vue-scrollto";
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

const PackageFormSchema = Joi.object({
  repo: Joi.string().required().default(""),
  branch: Joi.string().required().default(""),
  packageJson: Joi.string().required().default(""),
  readme: Joi.string().allow("").default(""),
  licenseId: Joi.string().allow("").default(""),
  licenseName: Joi.string().required().default(""),
  hunter: Joi.string().required().default(""),
  gitTagPrefix: Joi.string().allow("").default(""),
  gitTagIgnore: Joi.string().allow("").default(""),
  minVersion: Joi.string().allow("").default(""),
  topics: Joi.array().min(1).required().default([]),
  image: Joi.string().allow("").default(""),
  readme_zhCN: Joi.string().allow("").default(""),
  displayName_zhCN: Joi.string().allow("").default(""),
  description_zhCN: Joi.string().allow("").default(""),
});

export default {
  components: { ParentLayout, NavLink },
  data() {
    const newData = {
      isSubmitting: false,
      step: 0,
      form: {
        errors: {},
        values: {
          repo: "",
          branch: "",
          packageJson: "",
          readme: "",
          licenseId: "",
          licenseName: "",
          gitTagPrefix: "",
          gitTagIgnore: "",
          minVersion: "",
          topics: [],
          image: "",
          hunter: "",
          readme_zhCN: "",
          displayName_zhCN: "",
          description_zhCN: "",
        },
        prompts: {
          packageJson: "",
          readme: "",
        },
        options: {
          topics: [],
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
    Object.keys(newData.form.values).forEach((key) => {
      newData.form.errors[key] = "";
    });
    return newData;
  },
  computed: {
    blockedScopes() {
      return this.$page.frontmatter.blockedScopes;
    },
    licenses() {
      return this.$page.frontmatter.licenses;
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
    gitHubHowToCreatePRLink() {
      return {
        link: "https://docs.github.com/repositories/working-with-files/managing-files/creating-new-files",
        text: "Creating new files on GitHub",
      };
    },
    gitHubSecurityLink() {
      return {
        link: "https://github.blog/2021-04-22-github-actions-update-helping-maintainers-combat-bad-actors",
        text: "GitHub Actions update",
      };
    },
    gitHubSocialImageLink() {
      return {
        link: "https://help.github.com/en/github/administering-a-repository/customizing-your-repositorys-social-media-preview",
        text: "GitHub Social Image",
      };
    },
    packageLink() {
      return {
        link: "/packages/" + this.$data.packageInfo.name,
        text: "/packages/" + this.$data.packageInfo.name,
      };
    },
    sponsorLink() {
      return {
        link: "https://www.patreon.com/openupm",
        text: "Patreon",
      };
    },
  },
  mounted() {
    let topics = this.$page.frontmatter.topics;
    this.$data.form.options.topics = topics.map(function (x) {
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
      let repo = this.$data.form.values.repo;
      this.$data.form.values.repo = repo
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
      if (this.form.values.packageJson) {
        this.fetchPackageInfo();
      }
    },
    onGoClick() {
      let repo = this.$data.form.values.repo;
      if (repo) {
        this.$data.isSubmitting = true;
        this.$data.step = SubmitStep.FillForm.value;
        this.$data.form.values.branch = "";
        this.$data.form.values.displayName_zhCN = "";
        this.$data.form.values.description_zhCN = "";
        this.$data.form.values.gitTagPrefix = "";
        this.$data.form.values.gitTagIgnore = "";
        this.$data.form.values.licenseId = "";
        this.$data.form.values.licenseName = "";
        this.$data.form.values.minVersion = "";
        this.$data.form.values.readme = "";
        this.$data.form.values.readme_zhCN = "";
        this.$data.form.values.image = "";
        this.$data.form.values.hunter = "";
        this.$data.form.values.packageJson = "";
        this.$data.form.prompts.packageJson = "";
        for (const topic of this.$data.form.options.topics) topic.value = false;
        this.$data.repoInfo = {};
        this.$data.repoImages = [];
        this.$data.packageJsonPaths = {};
        this.$data.packageInfo = {};
        this.$data.readmePaths = {};
        this.$data.branches = [];
        this.$data.yaml = "";
        this.$data.yamlFilename = "";
        this.fetchRepoInfo();
        this.fetchBranches();
        this.fetchRepoImage();
      }
    },
    onSelectImage(item) {
      if (this.$data.form.values.image != item)
        this.$data.form.values.image = item;
      else this.$data.form.values.image = null;
    },
    onTopicsChange() {
      const form = this.$data.form;
      form.values.topics = form.options.topics
        .filter((x) => x.value)
        .map((x) => x.slug);
    },
    onValidateForm() {
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
        displayName: packageInfo.displayName,
        description: packageInfo.description || repoInfo.description || "",
        repoUrl: repoInfo.html_url,
        parentRepoUrl: repoInfo.parent ? repoInfo.parent.html_url : null,
        licenseSpdxId: form.values.licenseId,
        licenseName: form.values.licenseName,
        topics: form.values.topics,
        hunter: form.values.hunter,
        gitTagPrefix: form.values.gitTagPrefix,
        gitTagIgnore: form.values.gitTagIgnore,
        minVersion: form.values.minVersion,
        image: form.values.image,
        readme: form.values.readme
          ? form.values.branch + ":" + form.values.readme
          : "master:README.md",
        readme_zhCN: form.values.readme_zhCN
          ? form.values.branch + ":" + form.values.readme_zhCN
          : "",
        displayName_zhCN: form.values.displayName_zhCN,
        description_zhCN: form.values.description_zhCN,
        createdAt: new Date().getTime(),
      };
      return yaml.safeDump(content);
    },
    guessLicenseId() {
      if (this.form.values.licenseName.value && !this.form.licenseId) {
        const spdxId = Object.keys(spdx).find(
          (x) =>
            spdx[x].name == this.form.values.licenseName ||
            x == this.form.values.licenseName
        );
        if (spdxId) {
          this.form.values.licenseId = spdxId;
          this.form.values.licenseName.value = spdx[this.form.licenseId].name;
        }
      }
    },
    resetFormError() {
      const errors = this.$data.form.errors;
      Object.keys(errors).forEach((key) => {
        errors[key] = "";
      });
    },
    async fetchRepoInfo() {
      try {
        // Clean error message.
        this.resetFormError();
        // Fetch.
        let resp = await axios.get(
          urljoin(util.githubReposApiUrl, this.form.values.repo),
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
          this.$data.form.values.licenseId = repoInfo.license.spdx_id;
          this.$data.form.values.licenseName = repoInfo.license.name;
        }
      } catch (error) {
        if (error.message.includes("404"))
          this.$data.form.errors.repo = "Repository not found";
        else this.$data.form.errors.repo = error.message;
      } finally {
        this.$data.isSubmitting = false;
      }
    },
    async fetchRepoImage() {
      try {
        // Clean error message.
        this.$data.form.errors.image = "";
        // Fetch.
        let resp = await axios.get(
          util.githubSearchCodeApiUrl +
            `?sort=indexed&q=extension:png+extension:jpg+extension:jpeg+extension:gif+repo:${this.form.values.repo}`,
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
        this.$data.form.errors.image = error.message;
      }
    },
    async fetchBranches() {
      this.$data.branches = [];
      try {
        // Clean error message.
        this.$data.form.errors.branch = "";
        let url =
          urljoin(util.githubReposApiUrl, this.form.values.repo, "branches") +
          "?per_page=100";
        // Traversing with pagination
        while (true) {
          let resp = await axios.get(url, {
            headers: { Accept: "application/vnd.github.v3.json" },
          });
          const branches = resp.data
            .map((x) => x.name)
            .filter((x) => !x.startsWith("all-contributors/"));
          for (const item of branches) this.$data.branches.push(item);
          // parse next url from resp.headers.link, refs https://docs.github.com/en/rest/guides/traversing-with-pagination
          let nextUrl = null;
          if (resp.headers.link) {
            const links = resp.headers.link.split(",");
            for (let link of links) {
              link = link.trim();
              const re = /<(https.*)>; rel=\"next\"/g;
              const match = re.exec(link);
              if (match) nextUrl = match[1];
            }
          }
          if (nextUrl) url = nextUrl;
          else break;
        }
        // Assign the default branch
        if (this.$data.branches.includes("master")) {
          this.$data.form.values.branch = "master";
          this.onBranchChange();
        } else if (this.$data.branches.includes("main")) {
          this.$data.form.values.branch = "main";
          this.onBranchChange();
        }
      } catch (error) {
        this.$data.form.errors.branch = error.message;
      }
    },
    async fetchGitTrees() {
      if (!this.form.values.branch) return;
      try {
        // Clean error message.
        this.$data.form.errors.packageJson = "";
        this.$data.form.errors.readme = "";
        // Fetch.
        const url = urljoin(
          util.githubReposApiUrl,
          this.form.values.repo,
          "git/trees",
          this.form.values.branch
        );
        this.$data.form.prompts.packageJson = this.$t(
          "loading-package-json-path"
        );
        this.$data.form.prompts.readme = this.$t("loading-readme-md-path");
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
          self.$data.form.values.packageJson = null;
          if (paths.length == 0) {
            self.$data.form.prompts.packageJson = "";
            self.$data.form.errors.packageJson = self.$t(
              "can-not-locate-the-path-of-pac"
            );
          } else if (paths.length == 1) {
            self.$data.form.values.packageJson = paths[0];
          } else if (paths.includes("package.json")) {
            self.$data.form.values.packageJson = "package.json";
          }
          if (self.$data.form.values.packageJson) {
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
            self.$data.form.prompts.readme = "";
            self.$data.form.errors.readme = self.$t(
              "no-markdown-file-found-fallbacks"
            );
          } else if (paths.length == 1) {
            self.$data.form.values.readme = paths[0];
          } else if (paths.includes("README.md")) {
            self.$data.form.values.readme = "README.md";
          } else {
            const filteredPath = paths.filter((x) => x.endsWith("README.md"));
            if (filteredPath.length > 0) {
              self.$data.form.values.readme = filteredPath[0];
            }
          }
        })();
      } catch (error) {
        this.$data.form.errors.packageJson = error.message;
      }
    },
    async fetchPackageInfo() {
      try {
        // Clean error message.
        this.$data.form.errors.packageJson = "";
        // Fetch.
        let url = urljoin(
          util.githubReposApiUrl,
          this.form.values.repo,
          "contents",
          this.form.values.packageJson,
          "?ref=" + this.$data.form.values.branch
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
          !this.$data.form.values.licenseName
        ) {
          this.$data.form.values.licenseName = this.$data.packageInfo.license;
        }
        // Verify unity registry
        // Unity registry didn't enable the cross origin requests, then the check cannot be done in a browser.
        // await this.verifyPackageExistInUnityRegistry(packageName);
      } catch (error) {
        VueScrollTo.scrollTo("#id_packageJson", 500, { offset: -80 });
        if (error.message.includes("404"))
          this.$data.form.errors.packageJson = "File not found: package.json.";
        else this.$data.form.errors.packageJson = error.message;
      }
    },
    async verifyPackageExistInUnityRegistry(packageName) {
      try {
        let url = urljoin(util.unityRegistryUrl, packageName);
        let resp = await axios.get(url);
        throw new Error(this.$t("package-already-exists-in-unity-registry"));
      } catch (error) {}
    },
    verifyPackage() {
      this.resetFormError();
      const result = PackageFormSchema.validate(this.$data.form.values, {
        abortEarly: false,
      });
      if (result.error) {
        result.error.details.forEach((error) => {
          this.$data.form.errors[error.path[0]] = error.message;
        });
        const firstFieldSelector = "#id_" + result.error.details[0].path[0];
        VueScrollTo.scrollTo(firstFieldSelector, 500, { offset: -80 });
        return false;
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
      margin: 0.8rem 0.4rem;
      border: 1px solid #eee;

      h5 {
        font-size: 14px;
        font-weight: bold;
        padding: 0.4rem;
      }
    }
  }
}
</style>
