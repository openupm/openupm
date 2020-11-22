/**
 * Media util that download, process and upload image S3
 **/

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("config");
const sharp = require("sharp");

const logger = require("../utils/log")(module);
const redis = require("../db/redis");
const s3 = require("./s3");
const { AxiosService, CancelToken } = require("../utils/http");

const dataDir = path.resolve(__dirname, "../../data");
const mediaDir = path.resolve(dataDir, "media");

/**
 * Download, process a image and upload to S3.
 * @param {object} param0
 */
const addImage = async function({
  imageUrl,
  width,
  height,
  fit,
  duration,
  filename,
  force
}) {
  const key = getMediaKey({ imageUrl, width, height, fit });
  const expire = new Date().getTime() + duration;
  const oldImageEntry = await getImage({ imageUrl, width, height, fit });

  // download image to a tmp file
  const tmpFilename = getMediaTempFilename({ imageUrl, width, height, fit });
  const tmpFilePath = path.join(mediaDir, tmpFilename);
  await _downloadImageUrl(imageUrl, tmpFilePath);

  try {
    // check the image size
    const newSize = fs.statSync(tmpFilePath).size;
    if (oldImageEntry && !force) {
      const oldSize = oldImageEntry.size;
      if (oldSize == newSize) {
        // update the expire time
        await redis.client.hset(key, "expire", expire);
        logger.info(
          { imageUrl, width, height, fit },
          "_cacheImage size remains the same, only update the expire time"
        );
        return;
      }
    }

    // process the image
    if (!filename)
      filename = getMediaFilename({
        imageUrl,
        width,
        height,
        fit,
        size: newSize
      });
    const filePath = path.join(mediaDir, filename);
    await _processImage({
      sourcePath: tmpFilePath,
      destLocalPath: filePath,
      destS3Path: getMediaS3Path(filename),
      width,
      height,
      fit
    });

    // update redis
    await redis.client.hmset(key, {
      size: newSize,
      expire,
      filename
    });
  } finally {
    // remove the tmp file
    fs.unlinkSync(tmpFilePath);
  }
};

/**
 * Download the image url to the dest path
 * @param {string} imageUrl
 * @param {string} destPath
 */
const _downloadImageUrl = async function(imageUrl, destPath) {
  let resp = null;
  const source = CancelToken.source();
  setTimeout(() => {
    if (resp === null) source.cancel("ECONNTIMEOUT");
  }, 10000);
  const headers = {};
  resp = await AxiosService.create().get(imageUrl, {
    headers,
    cancelToken: source.token,
    responseType: "stream"
  });
  const readStream = resp.data;
  const writeStream = fs.createWriteStream(destPath);
  readStream.pipe(writeStream);
  const streamEnd = new Promise(function(resolve, reject) {
    writeStream.on("close", () => resolve(null));
    readStream.on("error", reject);
  });
  await streamEnd;
  logger.info({ imageUrl, destPath }, "image downloaded");
};

/**
 * Process the image and upload to s3
 * @param {object} param0
 */
const _processImage = async function({
  sourcePath,
  destLocalPath,
  destS3Path,
  width,
  height,
  fit
}) {
  const image = sharp(sourcePath);
  await image
    .resize(width, height, {
      fit,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toFile(destLocalPath);
  // copy to s3
  await s3.uploadFile({
    bucket: config.s3.mediaBucket,
    localPath: destLocalPath,
    remotePath: destS3Path,
    acl: "public-read",
    contentType: "image/png"
  });
  logger.info({ sourcePath, destLocalPath, destS3Path }, "image processed");
};

/**
 * Get media filename
 * @param {object} param0
 */
const getMediaFilename = function({
  imageUrl,
  width,
  height,
  fit,
  extname,
  size
}) {
  const md5 = crypto
    .createHash("md5")
    .update(imageUrl)
    .digest("hex");
  if (!extname) extname = "png";
  return `${md5}-${width}x${height}-${fit}-${size}.${extname}`;
};

/**
 * Get media key
 * @param {object} param0
 */
const getMediaKey = function({ imageUrl, width, height, fit }) {
  const md5 = crypto
    .createHash("md5")
    .update(imageUrl)
    .digest("hex");
  return `media:${md5}-${width}x${height}-${fit}`;
};

/**
 * Get media S3 path
 * @param {string} filename
 */
const getMediaS3Path = function(filename) {
  return `media/${filename}`;
};

/**
 * Get media tmp filename
 * @param {object} param0
 */
const getMediaTempFilename = function({ imageUrl, width, height, fit }) {
  const md5 = crypto
    .createHash("md5")
    .update(imageUrl)
    .digest("hex");
  const now = new Date().getTime();
  return `${md5}-${width}x${height}-${fit}-${now}.tmp`;
};

/**
 * Get the image entry { available, filename, filePath, s3Path, expire, size }
 * @param {object} param0
 */
const getImage = async function({ imageUrl, width, height, fit }) {
  const key = getMediaKey({ imageUrl, width, height, fit });
  const obj = await redis.client.hgetall(key);
  if (!obj) return null;
  obj.size = parseInt(obj.size) || 0;
  if (!obj.filename)
    obj.filename = getMediaFilename({
      imageUrl,
      width,
      height,
      fit,
      size: obj.size
    });
  obj.filePath = path.join(mediaDir, obj.filename);
  obj.s3Path = getMediaS3Path(obj.filename);
  obj.expire = parseInt(obj.expire) || 0;
  const now = new Date().getTime();
  obj.available = now <= obj.expire;
  return obj;
};

module.exports = { addImage, getImage };
