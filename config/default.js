// Default configurations.

module.exports = {
  // Debug flag
  debug: true,

  // Web app service port.
  port: 3600,

  // Redis.
  redis: {
    host: "127.0.0.1",
    port: 6379,
    db: 0
  },

  // Queue settings.
  queueSettings: {
    emitter: {
      removeOnSuccess: true,
      removeOnFailure: false,
      isWorker: false,
      // The queue does not need to receive job events.
      getEvents: false,
      // The queue does not store jobs, so you can use Queue#getJob to check job status safely.
      storeJobs: false,
      // The queue is not responsible for activating delayed jobs.
      activateDelayedJobs: false
    },
    worker: {
      removeOnSuccess: true,
      removeOnFailure: false,
      isWorker: true,
      // The queue is responsible for activating delayed jobs.
      activateDelayedJobs: true
    }
  },

  // Jobs.
  jobs: {
    concurrent: 5,
    checkStalledJobsInterval: 5000,
    buildPackage: {
      queue: "main",
      key: "build-pkg",
      retries: 2,
      backoff: ["fixed", 60 * 1000],
      timeout: 60 * 5,
    },
    buildRelease: {
      queue: "main",
      key: "build-rel",
      retries: 2,
      backoff: ["fixed", 60 * 1000],
      delay: 10,
      timeout: 60 * 60,
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
