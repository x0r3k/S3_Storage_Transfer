const AWS = require('aws-sdk');
const config = require('./awsConfig.json');

AWS.config.update({
    accessKeyId: config.newS3.accessKeyId,
    secretAccessKey: config.newS3.secretAccessKey,
    region: config.newS3.region
});

const s3 = new AWS.S3();

module.exports = s3;
