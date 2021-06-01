// Development mode configurations.

module.exports = {
  debug: true,
  s3: {
    config: {
      endpoint: "http://127.0.0.1:9000",
      accessKeyId: "minioadmin",
      secretAccessKey: "minioadmin",
      sslEnabled: false
    }
  }
};
