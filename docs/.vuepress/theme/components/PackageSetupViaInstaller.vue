<template>
  <Modal :id="modalId">
    <template #title>
      {{ $t("install-via-package-installer") }}
      <small
        ><span class="label label-secondary">{{ $t("experimental") }}</span>
      </small>
    </template>
    <template #body>
      <p>
        <NavLink :item="installerSiteLink" />
        {{ $t("install-via-package-installer-intro") }}
      </p>
      <ul>
        <li>
          <a :href="installerLink.link" class="btn btn-sm">{{
            installerLink.text
          }}</a>
        </li>
        <li>
          {{ $t("install-via-package-installer-step-2") }}
        </li>
        <li>
          {{ $t("install-via-package-installer-step-3") }}
        </li>
      </ul>
    </template>
  </Modal>
</template>

<script>
import Modal from "@theme/components/Modal.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: { Modal },
  props: {
    packageName: { type: String, default: "" },
    installerLink: { type: Object, default: () => {} }
  },
  computed: {
    modalId() {
      return "modal-packageinstaller";
    },
    installerSiteLink() {
      return {
        link: util.packageInstallerSiteUrl,
        text: this.$t("needles-package-installer")
      };
    }
  }
};
</script>
