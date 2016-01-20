var AWS = require('aws-sdk');
require('dotenv').load();

var s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
});

var event = require('./s3-event.json');
var bucket = event.Records[0].s3.bucket.name;
var key = event.Records[0].s3.object.key;

var params = {
  Bucket: bucket,
  Key: key
};

s3.getObject(params, function(err, s3Data) {
  if (err) throw err;
  console.log(s3Data.Body.toString());
});

