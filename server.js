const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const projects = require('./app/views/projects');
const logger = require('./app/utils/log')(module);
const app = express();
app.use(bodyParser.json());

// Restful
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});

// Index
app.get('/', (req, res) => {
  res.send('OpenUPM');
})

// Projects
app.use('/projects/', projects);

// Run server
app.listen(config.port, function () {
  logger.info(`app listening at port ${config.port}`);
});
