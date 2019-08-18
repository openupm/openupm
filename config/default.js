module.exports = {
  // Debug flag
  debug: true,

  // Web app service port.
  port: 3600,

  // Redis.
  // redisUrl: "redis://127.0.0.1:6379/",
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    options: {}
  },

  // DB.
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
  job: {
    concurrent: 1,
    keys: {
      project: 'proj',
    },
  },

  // GitHub.
  gitHub: {
    endpoint: 'https://api.github.com/graphql',
    timeout: 10000,
    token: '',
  }
};
