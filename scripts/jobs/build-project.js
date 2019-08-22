// Fetch project information and generate sub-jobs.

'use strict';
const path = require('path');
const config = require('config');
const parseGitHubUrl = require('parse-github-url');
const knex = require('../../app/db/postgres');
const { ProjectState, ProjectSource, ReleaseState } = require('../../app/models/common');
const gitHubGraphQL = require('../../app/utils/github-graphql');
const licenseUtil = require('../../app/utils/license');
const { semverRe } = require('../../app/utils/semver');
const { getQueue, QueueName } = require('../queue');
const emitterQueue = getQueue(QueueName.emitter);
const { genReleaseJob } = require('../gens/gen-release-job');
const logger = require('../../app/utils/log')(module);

// Build project for given id.
let buildProject = async function (id) {
  // Fetch project from database.
  let project = await knex('project').where({ id }).first();
  if (!project)
    throw new Error("Project record not found, id=" + id);
  let builder = ProjectBuilder.createBuilder(project);
  if (builder)
    await builder.build();
  else {
    // No builder found, set project to backlog state.
    let row = knex.touchUpdateAt({ state: ProjectState.backlog });
    await knex('project').where({ id }).update(row);
  }
}

// Base class of project builder.
class ProjectBuilder {

  // Factory method.
  static createBuilder(project) {
    if (project.source == ProjectSource.gitHub)
      return new GitHubProjectBuilder(project);
  }

  constructor(project) {
    this.project = project;
  }

  async build() {
    let row = knex.touchUpdateAt({});
    // Update info.
    logger.info(`[id=${this.project.id}] fetch info.`);
    await this.updateInfo(row);
    // Update license.
    logger.info(`[id=${this.project.id}] fetch license.`);
    await this.updateLicense(row);
    row.is_license_ok = Boolean(row.license_key);
    // Detect package manifest.
    logger.info(`[id=${this.project.id}] fetch package manifest.`);
    let packageManifest = await this.fetchPackageManifest(row);
    row.has_package = Boolean(packageManifest);
    // Handle state.
    if (!row.is_license_ok)
      row.state = ProjectState.rejected;
    else if (!row.has_package)
      row.state = ProjectState.rejected;
    else
      row.state = ProjectState.active;
    // Save to database
    await knex('project').update(row).where({ id: this.project.id });
    this.project = await knex('project').where({ id: this.project.id }).first();
    // Update package record and release records.
    if (row.has_package) {
      let pkg = await this.updatePackageRecord(packageManifest);
      let releases = await this.updateReleaseRecords(pkg);
      await this.genReleaseJobs(releases);
    }
  }

  // Update package record for given package manifest.
  async updatePackageRecord(packageManifest) {
    logger.info(`[id=${this.project.id}] update package record.`);
    let row = knex.touchUpdateAt({
      project_id: this.project.id,
      name: packageManifest.name,
      display_name: packageManifest.displayName || '',
      description: packageManifest.description || this.project.description,
      repo_branch: this.project.repo_branch,
    });
    let pkg = await knex('package').where({ name: row.name }).first();
    if (pkg)
      await knex('package').update(row).where({ id: pkg.id });
    else
      await knex('package').insert(row).returning('id');
    return await knex('package').where({ name: row.name }).first();
  }

  // Update release records for given package record.
  async updateReleaseRecords(pkg) {
    logger.info(`[id=${this.project.id}] update release records.`);
    let tags = (await this.getTagList()).filter(x => semverRe.test(x));
    /* Remove protentional duplications. It is possible for a repo to
     * have both v1.0.0 and 1.1.0 tags. If that happens, simply keep
     * the latest one.
     */
    let uniqueVersionSet = new Set();
    let cleanTagList = [];
    for (let tag of tags) {
      let version = this.getVersionFromTag(tag);
      if (!uniqueVersionSet.has(version)) {
        uniqueVersionSet.add(version);
        cleanTagList.push(tag);
      }
    }
    let releases = [];
    for (let tag of cleanTagList)
      releases.push(await this.updateReleaseRecord(pkg, tag));
    return releases;
  }

  // Update release record for given package record and tag.
  async updateReleaseRecord(pkg, tag) {
    let version = this.getVersionFromTag(tag);
    let nameWithVersion = pkg.name + '/' + version;
    let release = await knex('release').where({ name_with_version: nameWithVersion }).first();
    if (!release) {
      let row = knex.touchUpdateAt({
        package_id: pkg.id,
        name_with_version: nameWithVersion,
        version,
        commit: '',
        tag,
        state: ReleaseState.pending,
      });
      await knex('release').insert(row).returning('id');
      release = knex('release').where({ name_with_version: nameWithVersion }).first();
    }
    return release;
  }

  // Generate release jobs for given release records.
  async genReleaseJobs(releases) {
    for (let release of releases) {
      switch (release.state) {
        case ReleaseState.pending:
        case ReleaseState.building:
          // Get the job.
          let job = await emitterQueue.getJob(config.jobs.release.key + ':' + release.id);
          if (job) {
            // If run out of retries, Set job.state to failed, and clean it.
            if (job.status == 'failed' && job.options.retries <= 0) {
              // Change release.state state to failed.
              await knex('release')
                .where({ id: release.id })
                .update(knex.touchUpdateAt({ state: ReleaseState.failed }));
              await emitterQueue.removeJob(job.id);
              logger.warn(`[id=${this.project.id}] [release_id=${release.id}] failed.`);
            }
          } else {
            // Generate release job.
            job = await genReleaseJob(release);
            // Change release.state to building.
            await knex('release')
              .where({ id: release.id })
              .update(knex.touchUpdateAt({ state: ReleaseState.building }));
          }
          break;
        case ReleaseState.succeeded:
          break;
        case ReleaseState.failed:
          break;
        default:
          logger.warn(`[id=${this.project.id}] [release_id=${release.id}] unknown state '${release.state}'`);
          break;
      }
    }
  }

  // Return version string from given tag by removing leading letter 'v'
  getVersionFromTag(tag) {
    return tag.startsWith('v') ? tag.substr(1) : tag;
  }

  //#region interface
  // Update row for project info.
  async updateInfo(row) { }

  // Update row for license info.
  async updateLicense(row) { }

  // Return decoded package file (package.json).
  async fetchPackageManifest(row, packagePath) { }

  // Return tag list of project repo, latest first.
  async getTagList() { }
  //#endregion interface
}

// GitHub project builder.
class GitHubProjectBuilder extends ProjectBuilder {

  constructor(project) {
    super(project);
    // The parsed GitHub url.
    this.gitHubUrl = null;
    // The RepositoryInfo object, see https://developer.github.com/v4/interface/repositoryinfo/
    this.repo = null;
  }

  //#region interface
  async updateInfo(row) {
    // Parse url to get owner and name.
    this.gitHubUrl = parseGitHubUrl(this.project.url);
    // Fetch repo from github graphql.
    let variables = {
      owner: this.gitHubUrl.owner,
      name: this.gitHubUrl.name,
      tree: this.gitHubUrl.branch + ':',
    };
    let graphQLClient = gitHubGraphQL.createGraphQLClient();
    let data = await graphQLClient.request(gitHubGraphQL.repoInfo, variables);
    this.repo = data.repository;
    // Update project info.
    Object.assign(row, {
      url: this.repo.url,
      name: this.repo.name,
      owner: this.repo.nameWithOwner.split('/')[0],
      owner_avatar_url: this.repo.owner.avatarUrl,
      description: this.repo.description || '',
      is_fork: this.repo.isFork,
      is_archived: this.repo.isArchived,
      repo_branch: this.gitHubUrl.branch,
      use_og_image: this.repo.usesCustomOpenGraphImage,
      og_image_url: this.repo.openGraphImageUrl,
      star: this.repo.stargazers.totalCount,
      pushed_at: this.repo.pushedAt,
    });
  }

  async updateLicense(row) {
    if (this.repo.licenseInfo && this.repo.licenseInfo.key != "other") {
      // Use github license info if possible.
      row.license_key = this.repo.licenseInfo.key;
      row.license_name = this.repo.licenseInfo.name;
      return;
    }
    // Find license file.
    let filenames = this.repo.tree.entries.map(x => x['name']);
    let filename = null;
    for (let x of filenames) {
      if (licenseUtil.licenseFilenames.includes(x.toLowerCase())) {
        filename = x;
        break;
      }
    }
    if (filename) {
      // Fetch license file.
      let text = await this.fetchGitFileContent(row.owner, row.name, row.repo_branch, filename);
      if (text) {
        let licenseKey = licenseUtil.detectLicenseKey(text);
        if (licenseKey) {
          row.license_key = licenseKey;
          row.license_name = licenseUtil.licenses[licenseKey]['name'];
        }
      }
    }
  }

  async getTagList() {
    return this.repo.tags.nodes.map(x => x['name']);
  }
  //#endregion interface

  //#region helpers
  // Return fetched package.json file content.
  async fetchPackageManifest(row, packagePath) {
    if (!packagePath)
      packagePath = '';
    let filename = path.join(packagePath, 'package.json');
    let text = await this.fetchGitFileContent(row.owner, row.name, row.repo_branch, filename);
    return text ? JSON.parse(text) : null;
  }

  // Return fetched git file content.
  async fetchGitFileContent(owner, name, branch, filename) {
    let graphQLClient = gitHubGraphQL.createGraphQLClient();
    let variables = {
      owner: owner,
      name: name,
      tree: branch + ':' + filename,
    };
    let data = await graphQLClient.request(gitHubGraphQL.gitFileContent, variables);
    if (data.repository.tree)
      return data.repository.tree.text;
    else
      return null;
  }
  //#endregion helpers
}

module.exports = buildProject;

if (require.main === module) {
  let program = require('../../app/utils/commander');
  let projectId = null;
  program
    .arguments('<id>')
    .action((id) => { projectId = parseInt(id); })
    .requiredArgument(1)
    .parse(process.argv)
    .run(buildProject, projectId);
}
