const oldS3 = require('./old_AWS_S3');
const newS3 = require('./new_AWS_S3');
const config = require('./awsConfig.json');
const stream = require('stream');
const path = require('path');

async function checkBucket (oldS3, newS3, folder) {
  //delete folder and its content from new S3 Storage
  // await emptyS3Directory(newS3, config.newS3.bucketName, 'Test_Folder/');

  
  // get list of objects from specific folder of old S3 Storage
  let videos = await oldS3.listObjectsV2({Bucket: config.oldS3.bucketName, Prefix: folder}).promise();
  //check if folder is not empty
  if(videos.KeyCount) {
    //map objects in folder
    videos.Contents.forEach(item => {
      //check if object is file (file has size, folder hasnt)
      if(item.Size) {
        
        let objectName = path.basename(item.Key);
        let videoIndex = objectName.split('__')[0];
        let sameObjects = videos.Contents.filter(item => {
          let itemIndex = path.basename(item.Key).split('__')[0];
          if(itemIndex === videoIndex) return true;
        })
        console.log(sameObjects);
        //create params to get object from folder
        // let videoParam = { Bucket: config.oldS3.bucketName, Key: item.Key };
        //create read stream to get file from old storage 
        // let readStreamFile = oldS3.getObject(videoParam).createReadStream();

        // write file in stream mode to new storage
        // readStreamFile.pipe(uploadFromStream(newS3, config.newS3.bucketName, item.Key))

      }
    });
  }
  
}


/** DELETE FOLDER AND ITS CONTENT
 * IT USED FOR DELETING FOLDER AT NEW S3 STORAGE BEFORE UPLOADING FILES HERE
 */
async function emptyS3Directory(s3, bucket, dir) {
  const listParams = {
      Bucket: bucket,
      Prefix: dir
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
      Bucket: bucket,
      Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

/** UPLOAD FILE TO S3 STORAGE IN STREAM MODE */
function uploadFromStream(s3, bucket, key) {
  var pass = new stream.PassThrough();

  var params = {Bucket: bucket, Key: key, Body: pass};
  s3.upload(params, function(err, data) {
    console.log(err, data);
  });

  return pass;
}


checkBucket(oldS3, newS3, 'Course1/');

// emptyS3Directory(oldS3, config.oldS3.bucketName, 'Test_Folder/');