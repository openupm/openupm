// Default configurations.

const defaultJobOptions = {
  removeOnComplete: true,
  removeOnFail: false,
  attempts: 3,
  timeout: 60000,
  backoff: {
    type: "exponential",
    delay: 30000,
  }
};

module.exports = {
  // Debug flag
  debug: true,

  // Web app service port.
  port: 3600,

  // Redis.
  redis: {
    host: "127.0.0.1",
    port: 6379,
    db: 0,
    retryStrategy(times) {
      return 5000;
    },
  },

  // Queue settings.
  queueSettings: {
    pkg: {
      concurrency: 5,
      defaultJobOptions
    },
    rel: {
      concurrency: 5,
      defaultJobOptions
    },
  },

  // Jobs.
  jobs: {
    buildPackage: {
      queue: "pkg",
      name: "build-pkg",
      timeout: 60000 * 5,
    },
    buildRelease: {
      queue: "rel",
      name: "build-rel",
      timeout: 60000 * 30,
      interval: 30000,
    }
  },

  // GitHub.
  gitHub: {
    endpoint: "https://api.github.com/graphql",
    timeout: 10000,
    token: ""
  },

  // Azure devops.
  azureDevops: {
    endpoint: "https://dev.azure.com/openupm",
    token: "",
    project: "openupm",
    definitionId: 1,
    check: {
      // The estimated wait time for azure to process a build.
      duration: 45 * 1000,
      // Repeat check count.
      retries: 5,
      // Repeat interval step - [interval, interval * 2, ..., interval * retries].
      retryIntervalStep: 10 * 1000
    },
    buildUrlBase:
      "https://dev.azure.com/openupm/43915a16-5763-427d-8190-b9eccec12894/"
  },

  // Feeds
  feeds: {
    recentUpdateCount: 50
  },

  // PackageExtra
  packageExtra: {
    image: { width: 600, height: 300, duration: 24 * 3600 * 1000 },
    avatar: {
      small: { size: 48, duration: 24 * 3600 * 1000 },
      normal: { size: 128, duration: 24 * 3600 * 1000 }
    }
  },

  s3: {
    config: {
      endpoint: "",
      accessKeyId: "",
      secretAccessKey: "",
      s3ForcePathStyle: true
    },
    mediaBucket: "openupm"
  },

  healthCheck: {
    ids: {
      fetchPackageExtra: "",
      aggregatePackageExtra: "",
      updateRecentPackages: "",
      fetchSiteInfo: "",
      updateFeeds: "",
      fetchBackerData: "",
      addBuildPackageJob: ""
    }
  }
};
