<template>
  <ParentLayout>
    <main class="applayout">
      <div class="sideview">
        <vue-custom-scrollbar class="scroll-area">
          <div class="container">
            <div class="adp-sidebar hide-sm">
              <AdBlock />
            </div>
            <slot name="sideview"></slot>
          </div>
        </vue-custom-scrollbar>
      </div>
      <div class="mainview">
        <div class="container">
          <div class="columns breadcrumbview">
            <slot name="breadcrumbview"></slot>
          </div>
        </div>
        <div class="contentview">
          <vue-custom-scrollbar
            class="scroll-area"
            :settings="contentviewCustomScrollbarSettings"
          >
            <div class="container">
              <slot name="contentview"></slot>
            </div>
          </vue-custom-scrollbar>
        </div>
        <Content class="theme-default-content custom" />
        <slot name="postcontentview"></slot>
      </div>
    </main>
  </ParentLayout>
</template>

<script>
import AdBlock from "@theme/components/AdBlock.vue";
import ParentLayout from "@theme/layouts/Layout.vue";
import vueCustomScrollbar from "vue-custom-scrollbar";

export default {
  components: { AdBlock, ParentLayout, vueCustomScrollbar },
  data() {
    return {
      contentviewCustomScrollbarSettings: {
        suppressScrollX: true
      }
    };
  }
};
</script>
