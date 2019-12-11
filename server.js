const config = require("config");
const { app } = require("./app/index");
const logger = require("./app/utils/log")(module);

// Run server
app.listen(config.port, function() {
  logger.info({ port: config.port }, "app listening");
});
