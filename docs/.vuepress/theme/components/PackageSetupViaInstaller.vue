<template>
  <Modal :id="modalId">
    <template #title>
      Install via Package Installer
      <small><span class="label label-secondary">experimental</span> </small>
    </template>
    <template #body>
      <p>
        <NavLink :item="installerSiteLink" /> creates a traditional
        <code>.unitypackage</code> helper to install a UPM package into your
        Unity project.
      </p>
      <ul>
        <li>
          <a :href="installerLink.link" class="btn btn-sm">{{
            installerLink.text
          }}</a>
        </li>
        <li>
          Open the downloaded file with your Unity editor or drag it into the
          Unity editor window.
        </li>
        <li>
          The installer will remove itself after installation.
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
        text: "Needle's package installer"
      };
    }
  }
};
</script>
