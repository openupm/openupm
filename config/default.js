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
    db: 0,
    options: {}
  },

  // Database.
  knex: {
    client: "pg",
    connection: {
      user: "openupm",
      password: "openupm",
      host: "localhost",
      port: 5432,
      database: "openupm"
    },
    pool: { min: 0, max: 10 },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  // Queues
  queues: {
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
    project: {
      key: "proj",
      retries: 2,
      backoff: ["fixed", 60 * 1000]
    },
    release: {
      key: "rel",
      retries: 2,
      backoff: ["fixed", 60 * 1000]
    }
  },

  // GitHub.
  gitHub: {
    endpoint: "https://api.github.com/graphql",
    timeout: 10000,
    token: ""
  },

  // Azure devops
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
      retryIntervalStep: 15 * 1000
    },
    buildUrlBase:
      "https://dev.azure.com/openupm/43915a16-5763-427d-8190-b9eccec12894/"
  }
};
