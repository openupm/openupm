<template>
  <Modal :id="modalId">
    <template #title>Install via Package Manager</template>
    <template #body>
      <p>Please follow the instrustions:</p>
      <ul>
        <li>open <strong>Edit/Project Settings/Package Manager</strong></li>
        <li>
          add a new Scoped Registry (or edit the existing OpenUPM entry)
          <dl class="setup-scoped-registry">
            <div v-for="(item, index) in registryItems" :key="index">
              <dt>{{ item.name }}</dt>
              <dd>
                <CopyWrapper :copy-text="item.value">
                  <code>{{ item.value }}</code>
                </CopyWrapper>
              </dd>
            </div>
          </dl>
        </li>
        <li>click <kbd>Save</kbd> (or <kbd>Apply</kbd>)</li>
        <li>open <strong>Window/Package Manager</strong></li>
        <li>click <kbd>+</kbd></li>
        <li>
          select <kbd>Add package by name...</kbd> or
          <kbd>Add package from git URL...</kbd>
        </li>
        <li>
          paste
          <CopyWrapper :copy-text="packageName"
            ><code>{{ packageName }}</code></CopyWrapper
          >
          into name
        </li>
        <li>
          paste
          <CopyWrapper :copy-text="packageVersion"
            ><code>{{ packageVersion }}</code></CopyWrapper
          >
          into version
        </li>
        <li>click <kbd>Add</kbd></li>
      </ul>
      <div class="divider text-center" data-content="OR"></div>
      <p>
        Alternatively, merge the snippet to
        <a href="https://docs.unity3d.com/Manual/upm-manifestPrj.html"
          >Packages/manifest.json</a
        >
      </p>
      <div class="theme-default-content custom">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="language-json" v-html="manifest"></div>
      </div>
    </template>
  </Modal>
</template>

<script>
import highlightjs from "highlight.js";
import Modal from "@theme/components/Modal.vue";
import CopyWrapper from "@theme/components/CopyWrapper.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: { CopyWrapper, Modal },
  props: {
    packageName: { type: String, default: "" },
    packageVersion: { type: String, default: "" },
    scopes: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    manifest() {
      const jsonData = {
        scopedRegistries: [
          {
            name: this.registryName,
            url: this.registryUrl,
            scopes: this.scopes,
          },
        ],
        dependencies: {},
      };
      jsonData.dependencies[this.packageName] = this.packageVersion;
      const jsonText = JSON.stringify(jsonData, null, 4);
      const highlighted = highlightjs.highlight("json", jsonText).value;
      return `<pre><code class="hljs json">${highlighted}</code></pre>`;
    },
    modalId() {
      return "modal-manualinstallation";
    },
    registryItems() {
      const items = [
        { name: "Name", value: this.registryName },
        { name: "URL", value: this.registryUrl },
      ];
      const scopes = this.scopes || [];
      for (let i = 0; i < scopes.length; i++) {
        const scope = scopes[i];
        items.push({ name: i == 0 ? "Scope(s)" : "", value: scope });
      }
      return items;
    },
    registryName() {
      return util.openupmRegistryUrl.replace("https://", "");
    },
    registryUrl() {
      return util.openupmRegistryUrl;
    },
  },
};
</script>

<style lang="stylus">
dl.setup-scoped-registry {
  margin-right: 2.5rem;
  border: 1px solid #eee;
  padding: 0.5rem;

  >div {
    padding-top: 0.1rem;
  }

  dt {
    display: inline-block;
    width: 3.3rem;
    word-wrap: break-word;
  }

  dd {
    display: inline;
    margin-left: 0;
    vertical-align: top;
  }

  dd:after {
    content: '';
    display: block;
  }
}
</style>
