<template>
  <ParentLayout>
    <main class="applayout">
      <div class="sideview">
        <Scrollbar class="scroll-area">
          <div class="container">
            <div class="adp adp-sidebar hide-sm">
              <AdBlock />
            </div>
            <slot name="sideview"></slot>
          </div>
        </Scrollbar>
      </div>
      <div class="mainview">
        <div class="container breadcrumb-container">
          <div class="columns breadcrumbview">
            <slot name="breadcrumbview"></slot>
          </div>
        </div>
        <div id="contentview" class="contentview">
          <Scrollbar
            class="scroll-area"
            :settings="contentviewCustomScrollbarSettings"
          >
            <div class="container">
              <slot name="contentview"></slot>
            </div>
          </Scrollbar>
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
import Scrollbar from "@theme/components/Scrollbar.vue";

export default {
  components: {
    AdBlock,
    ParentLayout,
    Scrollbar
  },
  data() {
    return {
      contentviewCustomScrollbarSettings: {
        suppressScrollX: true
      }
    };
  }
};
</script>
