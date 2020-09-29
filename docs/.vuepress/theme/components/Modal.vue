<template>
  <div :id="id" class="modal">
    <a href="#close" class="modal-overlay" aria-label="Close"></a>
    <div class="modal-container">
      <div v-if="showHeader" class="modal-header">
        <a
          href="#close"
          class="btn btn-clear float-right"
          aria-label="Close"
        ></a>
        <div class="modal-title h5"><slot name="title"></slot></div>
      </div>
      <div v-if="showBody" class="modal-body">
        <div class="content">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ""
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showBody: {
      type: Boolean,
      default: true
    }
  }
};
</script>
