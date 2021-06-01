// S3 util.

const fs = require("fs");
const config = require("config");
const AWS = require("aws-sdk");

/**
 * Get S3 client.
 */
const getS3Client = function() {
  AWS.config.update(config.s3.config);
  const s3Client = new AWS.S3();
  return s3Client;
};

/**
 * Upload file to S3.
 * @param {object} param0
 */
const uploadFile = function({
  bucket,
  localPath,
  remotePath,
  acl,
  contentType
}) {
  const s3 = getS3Client();
  const readStream = fs.createReadStream(localPath);
  var params = {
    Bucket: bucket,
    Delimiter: "/",
    Key: remotePath,
    Body: readStream
  };
  if (acl) params.ACL = acl;
  if (contentType) params.ContentType = contentType;

  return new Promise((resolve, reject) => {
    s3.upload(params, function(err, data) {
      readStream.destroy();
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

/**
 * Remove file from S3.
 * @param {object} param0
 */
const removeFile = function({ bucket, remotePath }) {
  const s3 = getS3Client();
  var params = {
    Bucket: bucket,
    Key: remotePath
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, function(err, data) {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

module.exports = { getS3Client, uploadFile, removeFile };
