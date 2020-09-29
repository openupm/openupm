<template>
  <div class="subpage-pipelines">
    <h2>
      Build Pipelines
      <span class="label label-rounded text-small">
        {{ releaseEntries.length }}
      </span>
    </h2>
    <section v-if="releaseEntries.length" class="col-12">
      <div v-if="!isLoading">
        <table class="table">
          <thead>
            <tr>
              <th class="td-icon"></th>
              <th>Git tag</th>
              <th>Version</th>
              <th>Commit</th>
              <th>Build</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in releaseEntries" :key="entry.tag">
              <td>
                <i :class="entry.icon"></i>
              </td>
              <td>{{ entry.tag }}</td>
              <td>
                {{ entry.version }}
              </td>
              <td><NavLink :item="entry.commitLink" /></td>
              <td><NavLink v-if="entry.buildId" :item="entry.buildLink" /></td>
              <td>
                <span>{{ entry.note }}</span>
                <span class="label text-small">{{ entry.errorCode }}</span>
                <span class="hide-sm">{{ entry.errorMessage }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <table v-if="invalidTagEntries.length" class="table">
          <thead>
            <tr>
              <th>Invalid Git tag (non-semver or duplicated version)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in invalidTagEntries" :key="entry.tag">
              <td><NavLink :item="entry.tagLink" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="skeleton-wrap">
        <VclList />
      </div>
    </section>
  </div>
</template>

<script>
import { VclList } from "vue-content-loading";
import urljoin from "url-join";

import NavLink from "@theme/components/NavLink.vue";
import { ReleaseState, ReleaseReason } from "@root/app/models/common";
import util from "@root/docs/.vuepress/util";

const ReleaseReasonNote = {};
ReleaseReasonNote[ReleaseReason.None.value] = "unknown error";
ReleaseReasonNote[ReleaseReason.BadRequest.value] = "server bad request";
ReleaseReasonNote[ReleaseReason.Unauthorized.value] = "server unauthorized";
ReleaseReasonNote[ReleaseReason.Forbidden.value] = "server forbidden";
ReleaseReasonNote[ReleaseReason.EntityTooLarge.value] =
  "the package is too large";
ReleaseReasonNote[ReleaseReason.VersionConflict.value] =
  "the version already exists";
ReleaseReasonNote[ReleaseReason.InternalError.value] = "server internal error";
ReleaseReasonNote[ReleaseReason.BadGateway.value] = "server bad gateway";
ReleaseReasonNote[ReleaseReason.ServiceUnavailable.value] =
  "server unavailable";
ReleaseReasonNote[ReleaseReason.BuildTimeout.value] = "the build is timeout";
ReleaseReasonNote[ReleaseReason.BuildCancellation.value] =
  "the build is cancelled manually";
ReleaseReasonNote[ReleaseReason.PackageNotFound.value] =
  "no package.json detected";
ReleaseReasonNote[ReleaseReason.Private.value] =
  "the package is explicitly private";
ReleaseReasonNote[ReleaseReason.PackageNameNotMatch.value] =
  "the name of package.json isn't matched";
ReleaseReasonNote[ReleaseReason.PackageNameInvalid.value] =
  "the package name includes unsupported @ character";

export default {
  components: { NavLink, VclList },

  props: {
    invalidTags: {
      type: Array,
      default: () => []
    },
    releases: {
      type: Array,
      default: () => []
    },
    repoUrl: {
      type: String,
      default: ""
    },
    isLoading: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    invalidTagEntries() {
      return this.invalidTags.map(x => {
        return {
          tag: x,
          tagLink: {
            link: urljoin(this.repoUrl, "releases/tag", x),
            text: x
          }
        };
      });
    },
    releaseEntries() {
      return this.releases.map(x => {
        const entry = {
          ...x,
          buildLink: {
            link: util.getAzureWebBuildUrl(x.buildId),
            text: x.buildId
          },
          commitLink: {
            link: urljoin(this.repoUrl, "commit", x.commit),
            text: x.commit.substring(0, 7)
          },
          icon: "",
          note: "",
          errorCode: "",
          errorMessage: ""
        };
        const stateEnum = ReleaseState.get(entry.state);
        if (stateEnum == ReleaseState.Pending) {
          entry.icon = "far fa-clock";
          entry.note = "Pending...";
        } else if (stateEnum == ReleaseState.Building) {
          entry.icon = "fa fa-spinner fa-spin";
          entry.note = "Building...";
        } else if (stateEnum == ReleaseState.Succeeded) {
          entry.icon = "fa fa-check-circle text-success";
        } else if (stateEnum == ReleaseState.Failed) {
          entry.icon = "fa fa-times-circle text-error";
          entry.errorCode = `E${entry.reason}`;
          entry.errorMessage = ReleaseReasonNote[entry.reason] || "";
        }
        return entry;
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.subpage-pipelines
  font-size $fontSizeMD

  .table
    display table

    .td-icon
      width 1rem
</style>
