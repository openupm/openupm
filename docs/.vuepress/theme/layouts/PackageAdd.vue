<!-- eslint-disable vue/no-v-html -->
<template>
  <ParentLayout>
    <main class="package-add">
      <div class="main-container container">
        <div class="columns breadcrumb-wrap">
          <div class="column col-12">
            <ul class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li class="breadcrumb-item">
                <a href="/packages/">Packages</a>
              </li>
              <li class="breadcrumb-item">
                <a href="#">Add</a>
              </li>
            </ul>
          </div>
          <div class="column col-12">
            <h1>Submit Open Source UPM Package</h1>
          </div>
          <div class="column col-5 col-sm-12">
            <fieldset v-if="!isStepFillFormChecked" :disabled="isSubmitting">
              <div class="columns">
                <div
                  class="form-group column col-12"
                  :class="{ 'has-error': form.repo.error }"
                >
                  <label class="form-label">Repository</label>
                  <div class="input-group">
                    <span class="input-group-addon">github.com/</span>
                    <input
                      v-model.trim="form.repo.value"
                      class="form-input"
                      type="text"
                      required
                      placeholder="owner/project-name"
                      @change="onRepoChange"
                    />
                    <button
                      class="btn btn-primary input-group-btn btn-go"
                      @click="onGoClick"
                    >
                      Go
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
                    'has-error': form.branch.error
                  }"
                >
                  <label class="form-label">Branch</label>
                  <select
                    v-model="form.branch.value"
                    class="form-select"
                    required
                  >
                    <option v-if="!branches.length" disabled selected value=""
                      >Loading branches...</option
                    >
                    <option
                      v-for="branch in branches"
                      :key="branch"
                      :value="branch"
                    >
                      {{ branch }}</option
                    >
                  </select>
                  <span v-if="form.branch.error" class="form-input-hint">
                    {{ form.branch.error }}
                  </span>
                </div>
                <div
                  id="packageFolder"
                  class="form-group column col-12"
                  :class="{
                    hide: hideOtherFields,
                    'has-error': form.packageFolder.error
                  }"
                  @change="onPackageFolderChange"
                >
                  <label class="form-label">Folder of package.json</label>
                  <input
                    v-model="form.packageFolder.value"
                    class="form-input"
                    type="text"
                    placeholder="leave empty for root"
                  />
                  <span v-if="form.packageFolder.error" class="form-input-hint">
                    {{ form.packageFolder.error }}
                  </span>
                </div>
                <div
                  class="form-group column col-12"
                  :class="{
                    hide: hideLicenseName || hideOtherFields,
                    'has-error': form.licenseName.error
                  }"
                >
                  <label class="form-label">License name</label>
                  <input
                    v-model="form.licenseName.value"
                    class="form-input"
                    type="text"
                  />
                  <span class="form-input-hint is-error">
                    No SPDX license found, please specify the license name.
                  </span>
                </div>
                <div
                  class="form-group column col-12"
                  :class="{
                    hide: hideOtherFields,
                    'has-error': form.topics.error
                  }"
                >
                  <label class="form-label">Topics</label>
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
                        {{ item.name }}
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  class="form-group column col-12"
                  :class="{ hide: hideOtherFields }"
                >
                  <label class="form-label">Discovered by</label>
                  <div class="input-group">
                    <span class="input-group-addon">github.com/</span>
                    <input
                      v-model="form.hunter.value"
                      class="form-input"
                      type="text"
                      placeholder="hunter"
                    />
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
                    Verify Package
                  </button>
                </div>
              </div>
            </fieldset>
            <div v-else>
              <pre class="code" data-lang="yaml">
                <code>{{ yaml }}</code>
              </pre>
              <div>
                <button
                  class="btn btn-primary tooltip tooltip-click"
                  data-tooltip="Copied"
                  @click="onCopyClick"
                >
                  Copy to Clipboard
                </button>
                <button class="btn btn-error" @click="onStartOver">
                  Start Over
                </button>
              </div>
            </div>
          </div>
          <div class="column col-1 col-sm-12"></div>
          <div class="column col-5 col-sm-12">
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
                              Fill the package form.
                            </p>
                            <p class="tile-subtitle">
                              Please provide informations of the UPM package.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="isStepFillFormChecked" class="timeline-item">
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
                              Package verified.
                            </p>
                            <p class="tile-subtitle">
                              The package is verified and data was attached to
                              the generated YAML file.
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
                              Upload the YAML file to GitHub and start a pull
                              request.
                            </p>
                            <ol>
                              <li>
                                Copy the content of the YAML file. Then open
                                <NavLink :item="uploadLink"></NavLink> page,
                                paste content to it.
                              </li>
                              <li>
                                Name the file as <code>{{ yamlFilename }}</code>
                              </li>
                              <li>
                                Scroll to the end of the page, click
                                <b>purpose new file</b>.
                              </li>
                              <li>Click <b>create pull request</b>.</li>
                            </ol>
                            <p class="tile-subtitle">
                              The package will be added to our build queue, once
                              the pull request get merged.
                            </p>
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
import copy from "copy-to-clipboard";
import Enum from "enum";
import urljoin from "url-join";
import VueScrollTo from "vue-scrollto";
const yaml = require("js-yaml");

import ParentLayout from "@theme/layouts/Layout.vue";
import NavLink from "@parent-theme/components/NavLink.vue";

const apiRepoUrl = "https://api.github.com/repos/";

const SubmitStep = new Enum({
  FillForm: 0,
  GetYamlFile: 1
});

export default {
  components: { ParentLayout, NavLink },
  data() {
    return {
      isSubmitting: false,
      step: 0,
      form: {
        repo: {
          error: "",
          value: ""
        },
        branch: {
          error: "",
          value: ""
        },
        packageFolder: {
          error: "",
          value: ""
        },
        licenseId: {
          error: "",
          value: null
        },
        licenseName: {
          error: "",
          value: ""
        },
        topics: {
          error: "",
          options: []
        },
        hunter: {
          error: "",
          value: ""
        }
      },
      hideOtherFields: true,
      repoInfo: {},
      packageInfo: {},
      branches: [],
      yaml: "",
      yamlFilename: ""
    };
  },
  computed: {
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
    uploadLink() {
      return {
        link: "https://github.com/openupm/openupm/new/master/data/packages",
        text: "openupm/data/packages"
      };
    }
  },
  mounted() {
    let topics = this.$page.frontmatter.topics;
    this.$data.form.topics.options = topics.map(function(x) {
      return { name: x.name, slug: x.slug, value: false };
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
      this.step = SubmitStep.FillForm.value;
    },
    onPackageFolderChange() {
      // Cleanify packageFolder
      let packageFolder = this.$data.form.packageFolder;
      if (packageFolder.value == ".") packageFolder.value = "";
      else if (packageFolder.value.startsWith("/"))
        packageFolder.value = packageFolder.value.substring(1);
      else if (packageFolder.value.startsWith("./"))
        packageFolder.value = packageFolder.value.substring(2);
      if (packageFolder.value.endsWith("/"))
        packageFolder.value = packageFolder.value.slice(0, -1);
    },
    onGoClick() {
      let repo = this.$data.form.repo.value;
      if (repo) {
        this.$data.isSubmitting = true;
        this.step = SubmitStep.FillForm.value;
        this.fetchRepoInfo();
        this.fetchBranches();
      }
    },
    onVerifyClick() {
      console.log("onVerifyClick");
      this.$data.isSubmitting = true;
      this.fetchPackageInfo();
    },
    onCopyClick() {
      copy(this.$data.yaml, { format: "text/plain" });
    },
    onStartOver() {
      this.$data.step = SubmitStep.FillForm;
      this.$data.hideOtherFields = true;
    },
    genYaml() {
      let form = this.$data.form;
      let repoInfo = this.$data.repoInfo;
      let packageInfo = this.$data.packageInfo;
      let content = {
        name: packageInfo.name,
        displayName: packageInfo.displayName || "",
        description: repoInfo.description,
        repoUrl: repoInfo.html_url,
        repoBranch: form.branch.value,
        packageFolder: form.packageFolder.value,
        fork: repoInfo.fork,
        licenseSpdxId: form.licenseId.value,
        licenseName: form.licenseName.value,
        topics: form.topics.options.filter(x => x.value).map(x => x.slug),
        hunter: form.hunter.value
      };
      return yaml.safeDump(content);
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
        let resp = await axios.get(urljoin(apiRepoUrl, this.form.repo.value), {
          headers: { Accept: "application/vnd.github.v3.json" }
        });
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
        } else {
          this.$data.form.licenseId.value = null;
          this.$data.form.licenseName.value = "";
        }
      } catch (error) {
        if (error.message.includes("404"))
          this.$data.form.repo.error = "Repository not found.";
        else this.$data.form.repo.error = error.message;
      } finally {
        this.$data.isSubmitting = false;
      }
    },
    async fetchBranches() {
      try {
        // Clean error message.
        this.$data.form.branch.error = "";
        // Fetch.
        let resp = await axios.get(
          urljoin(apiRepoUrl, this.form.repo.value, "branches"),
          {
            headers: { Accept: "application/vnd.github.v3.json" }
          }
        );
        // Assign data.
        let branches = resp.data
          .map(x => x.name)
          .filter(x => !x.startsWith("all-contributors/"));
        this.$data.branches = branches;
        if (branches.includes("master"))
          this.$data.form.branch.value = "master";
      } catch (error) {
        this.$data.form.branch.error = error.message;
      }
    },
    async fetchPackageInfo() {
      try {
        // Clean error message.
        this.$data.form.packageFolder.error = "";
        // Fetch.
        let url = urljoin(
          apiRepoUrl,
          this.form.repo.value,
          "contents",
          this.form.packageFolder.value,
          "package.json",
          "?ref=" + this.$data.form.branch.value
        );
        console.log(url);
        let resp = await axios.get(url, {
          headers: { Accept: "application/vnd.github.v3.json" }
        });
        // Assign data.
        let content = atob(resp.data.content);
        this.$data.packageInfo = JSON.parse(content);
        let packageName = this.$data.packageInfo.name;
        if (this.$page.frontmatter.packageNames.includes(packageName))
          throw new Error(
            `Package ${packageName} already exists. Please search it instead.`
          );
        if (packageName.includes("@"))
          throw new Error(
            `Package name "${packageName}" includes character '@', that is not accepted by UPM. Please contact package owner to modify it.`
          );
        this.step = SubmitStep.GetYamlFile.value;
        // Generate YAML.
        this.$data.yaml = this.genYaml();
        this.$data.yamlFilename = this.$data.packageInfo.name + ".yml";
      } catch (error) {
        VueScrollTo.scrollTo("#packageFolder", 500, { offset: -80 });
        if (error.message.includes("404"))
          this.$data.form.packageFolder.error = "package.json not found.";
        else this.$data.form.packageFolder.error = error.message;
      } finally {
        this.$data.isSubmitting = false;
      }
    }
  }
};
</script>

<style lang="stylus">
.package-add
  .main-container
    margin-top 1rem

    .btn-go
      width 3rem
    // #select-repo-source
    //   flex 0 1

    .theme-default-content
      max-width auto
      margin 0
      padding 0 0 2.5rem

      :first-child
        margin-top 0

    .how-to-section
      padding-left 0.5rem

      .timeline-content
        ol
          list-style decimal outside
</style>
