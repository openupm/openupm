<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="package-card">
    <div class="card">
      <div class="card-content">
        <div :class="{ columns: true, 'columns-horizontal': isHorizontalLayout }">
          <div :class="[
            'column',
            'column-image',
            isHorizontalLayout ? 'col-4' : 'col-12',
            pkg.image ? 'has-image' : 'no-image'
          ]">
            <div class="card-image-wrapper">
              <div class="card-image">
                <LazyImage v-if="pkg.image" :src="pkg.image" class="img-responsive" />
                <div v-else class="i-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 150"
                    :style="cardSvgImageInlineStyle">
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white"
                      font-weight="bold">{{ cardSvgText
                      }}</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div :class="['column', isHorizontalLayout ? 'col-8' : 'col-12']">
            <div class="card-header">
              <div class="card-title h5">
                <NavLink :item="pkg.link" />
              </div>
            </div>
            <div class="card-body">
              {{ pkg.description }}
            </div>
            <div class="card-footer">
              <div>
                <!-- <span v-if="pkg.parentOwner" class="chip">
                  <LazyImage
                    v-if="pkg.parentOwnerAvatarUrl"
                    :src="pkg.parentOwnerAvatarUrl"
                    :alt="pkg.parentOwner"
                    class="avatar avatar-sm"
                  />
                  <i v-else class="fa fa-user"></i>
                  {{ pkg.parentOwner }}
                </span> -->
                <span class="chip">
                  <LazyImage :src="pkg.ownerAvatarUrl" :alt="pkg.owner" class="avatar avatar-sm" />
                  {{ pkg.owner }}
                </span>
                <!-- <span v-if="pkg.parentRepoUrl" class="chip">
                  <i class="fa fa-code-branch"></i>Fork
                </span> -->
                <span v-if="timeValue" class="chip">
                  <i :class="timeIcon"></i>{{ pkg.timeAgoText }}
                </span>
              </div>
              <div>
                <span class="chip">
                  <i class="fa fa-star"></i>{{ pkg.stars }}
                </span>
                <!-- <span v-if="pkg.version" class="chip">
                  <i class="fas fa-tag"></i>{{ pkg.version }}
                </span> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavLink from "@theme/components/NavLink.vue";
import util from "@root/docs/.vuepress/util";

/**
 * Generate a value from a string input within a specified range.
 * @param {string} str - The input string to generate the hue from.
 * @param {number} rangeMin - The minimum value of the hue range (must be >= 0).
 * @param {number} rangeMax - The maximum value of the hue range (must be <= 255).
 * @returns {number} - The value within the specified range.
 */
const generateValueFromString = function (str, rangeMin, rangeMax) {
  if (rangeMin < 0) {
    rangeMin = 0;
  }
  if (rangeMax > 255) {
    rangeMax = 255;
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 2) - hash);
  }
  const hue = Math.abs(hash % (rangeMax - rangeMin + 1)) + rangeMin;
  return hue;
};

export default {
  components: { NavLink },
  props: {
    item: {
      type: Object,
      required: true
    },
    preferHorizontalLayout: {
      type: Boolean,
      default: false
    },
    timeField: {
      type: String,
      default: "updatedAt",
      validator: function (value) {
        // The value must match one of these strings
        return ["createdAt", "updatedAt"].indexOf(value) !== -1;
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    pkg() {
      const avatarSize = 48;
      const entry = {
        ...this.item,
        timeAgoText: util.timeAgoFormat(new Date(this.timeValue)),
        ownerAvatarUrl: util.getAvatarImageUrl(this.item.owner, avatarSize),
        parentOwnerAvatarUrl: this.item.parentOwner
          ? util.getAvatarImageUrl(this.item.parentOwner, avatarSize)
          : null
      };
      return entry;
    },
    isHorizontalLayout() {
      return (
        this.preferHorizontalLayout && this.$mq != "xs" && this.$mq != "sm"
      );
    },
    timeIcon() {
      return "fas fa-clock";
    },
    timeValue() {
      return this.timeField == "createdAt"
        ? this.item.createdAt
        : this.item.updatedAt;
    },
    cardSvgImageInlineStyle() {
      return `background: linear-gradient(37deg, ${this.stopColor1}, ${this.stopColor2});`
    },
    stopColor1() {
      const hue = generateValueFromString(this.item.link.text, 0, 180);
      const Saturation = generateValueFromString(this.item.link.text, 70, 95);
      const color = `hsl(${hue}, ${Saturation}%, 37%)`;
      console.log("stopColor1: " + color);
      return color;
    },
    stopColor2() {
      let hue = generateValueFromString(this.item.link.text, 150, 255);
      hue = (hue + 25) % 255;
      const Saturation = generateValueFromString(this.item.link.text, 30, 70);
      const color = `hsl(${hue}, ${Saturation}%, 17%)`;
      console.log("stopColor2: " + color);
      return color;
    },
    cardSvgText() {
      const text = this.item.link.text;
      const maxLen = 30;
      if (text.length > maxLen)
        return text.substring(0, maxLen - 3) + '...';
      else
        return text;
    },
  }
};

</script>

<style lang="stylus">
.package-card
  padding-bottom 0.8rem
  height calc(100% - 0.5rem)

  .card
    border 0
    box-shadow 0 .25rem .5rem rgba(48, 55, 66, .15)
    height 100%

    .columns-horizontal
      flex-direction row-reverse
      max-width $maxPackageCardWidth

      .card-image-wrapper
        .card-image
          height 95%

      .column-image
        position relative
        top -0.3rem
        display flex
        align-items center
        justify-content center

    .card-header
      padding-top 0.3rem

    .card-title
      height 1.15rem
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
      font-size 0.75rem
      > a
        font-weight 600

    .card-body
      padding-top: 0rem
      height 2rem
      overflow hidden
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
      text-overflow: -o-ellipsis-lastline;
      font-size 0.65rem

    .card-image-wrapper
      width 100%
      height 0
      overflow hidden
      padding-top calc(1 / 2 * 100%)
      position relative

      .card-image
        position absolute
        top 0
        left 0
        width 100%
        height 100%

        img
          width 100%
          height 100%
          object-fit contain
          object-position center center

        .i-wrapper
          width 100%
          height 100%
          display flex
          align-items center
          justify-content center

          i
            font-size 5.4rem
            color #999

    .card-footer
      padding 0.5rem 0.8rem 0.8rem 0.8rem

    .chip
      margin-bottom 0.2rem
      font-size 0.6rem

      i
        padding-right 0.3rem

    .chip.chip-icon-only
      i
        padding-right 0

@media (max-width: $MQMobileNarrow)
  .package-card
    .card
      .column-image
        &.no-image
          display none
</style>
