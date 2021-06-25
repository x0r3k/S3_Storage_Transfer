const AWS = require('aws-sdk');
const config = require('./awsConfig.json');

AWS.config.update({
    accessKeyId: config.oldS3.accessKeyId,
    secretAccessKey: config.oldS3.secretAccessKey,
    region: config.oldS3.region
});

const s3 = new AWS.S3();

module.exports = s3;
