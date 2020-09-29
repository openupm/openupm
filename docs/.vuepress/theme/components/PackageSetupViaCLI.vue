<template>
  <Modal :id="modalId">
    <template #title>
      Install via Command-Line Tool
    </template>
    <template #body>
      <p>
        Prerequisites: <NavLink :item="nodejsLink" /> and
        <NavLink :item="openupmCliRepoLink" />.
      </p>
      <div class="theme-default-content custom">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="language-sh" v-html="code"></div>
      </div>
    </template>
  </Modal>
</template>

<script>
import highlightjs from "highlight.js";

import Modal from "@theme/components/Modal.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: { Modal },
  props: {
    packageName: { type: String, default: "" }
  },
  computed: {
    code() {
      const code = `# Install openupm-cli
npm install -g openupm-cli

# Go to your Unity project directory
cd YOUR_UNITY_PROJECT_DIR

# Install package: ${this.packageName}
openupm add ${this.packageName}
`;
      const highlighted = highlightjs.highlight("sh", code).value;
      return `<pre><code class="hljs sh">${highlighted}</code></pre>`;
    },
    modalId() {
      return "modal-commandlinetool";
    },
    nodejsLink() {
      return {
        link: "https://nodejs.org/en/",
        text: "Node.js 12"
      };
    },
    openupmCliRepoLink() {
      return {
        link: util.openupmCliRepoUrl,
        text: "openupm-cli"
      };
    }
  }
};
</script>
