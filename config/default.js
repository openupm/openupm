// Default configurations.

module.exports = {
  // Debug flag
  debug: true,

  // Web app service port.
  port: 3600,

  // Redis.
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    options: {}
  },

  // Database.
  knex: {
    client: 'pg',
    connection: {
      user: "openupm",
      password: "openupm",
      host: "localhost",
      port: 5432,
      database: "openupm"
    },
    pool: { min: 0, max: 10 },
    migrations: {
      tableName: 'knex_migrations'
    },
  },

  // Jobs.
  jobs: {
    concurrent: 5,
    checkStalledJobsInterval: 5000,
    project: {
      key: 'proj',
      retries: 3,
      backoff: ['fixed', 60 * 1000],
    },
    release: {
      key: 'rel',
      retries: 3,
      backoff: ['fixed', 60 * 1000],
    }
  },

  // GitHub.
  gitHub: {
    endpoint: 'https://api.github.com/graphql',
    timeout: 10000,
    token: '',
  },

  // Azure devops
  azureDevops: {
    endpoint: 'https://dev.azure.com/openupm',
    token: '',
    project: 'openupm',
    definitionId: 1,
    retries: 10,
    retryDurationStep: 15 * 1000,
  }

};
