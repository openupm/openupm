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
        </li>
        <li>click <kbd>Add</kbd></li>
      </ul>
    </template>
  </Modal>
</template>

<script>
import Modal from "@theme/components/Modal.vue";
import CopyWrapper from "@theme/components/CopyWrapper.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: { CopyWrapper, Modal },
  props: {
    packageName: { type: String, default: "" },
    scopes: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
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
