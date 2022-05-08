<template>
  <Modal :id="modalId">
    <template #title>
      {{ $t("install-via-command-line-interface") }}
    </template>
    <template #body>
      <p>
        {{ $t("prerequisites") }}
        : <NavLink :item="nodejsLink" /> {{ $t("and") }}
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
      const cli =
        this.$site.themeConfig.region == "cn" ? "openupm-cn" : "openupm";
      const code = `# ${this.$t("install-openupm-cli")}
npm install -g openupm-cli

# ${this.$t("go-to-unity-project")}
cd YOUR_UNITY_PROJECT_DIR

# ${this.$t("install-package")}: ${this.packageName}
${cli} add ${this.packageName}
`;
      const highlighted = highlightjs.highlight("sh", code).value;
      return `<pre><code class="hljs sh">${highlighted}</code></pre>`;
    },
    modalId() {
      return "modal-commandlinetool";
    },
    nodejsLink() {
      return {
        link: "https://nodejs.org/en/download/",
        text: "Node.js 14 or above"
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
