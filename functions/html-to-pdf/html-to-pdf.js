var wkhtmltopdf = require('wkhtmltopdf')
  , moment      = require('moment')
  , fs          = require('fs')
  , AWS         = require('aws-sdk')
  , uuid        = require('uuid')
  , concat      = require('concat-stream')
  ;

// process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

require('dotenv').load();

var creds = {
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
};
var s3 = new AWS.S3(creds);
var sqs = new AWS.SQS(creds);


var getS3object = function (event, next) {
  var bucket = event.Records[0].s3.bucket.name;
  var key = event.Records[0].s3.object.key;
  var params = {Bucket: bucket, Key: key};

  s3.getObject(params, next);
};

var putS3object = function(bucket, key, data, mimeType, next) {
  var params = {
    Bucket: bucket,
    Key: key,
    ContentType: mimeType,
    ServerSideEncryption: "AES256",
    Body: data
  };

  s3.putObject(params, next);
};


//main Lambda entry point
var handler = function(event, context) {
  console.log('event', event);

  var options = {
    footerLeft: 'report date: ' + moment().toString(),
    footerRight: 'Page [page] of [topage]',
    footerFontSize: 6,
    footerFontName: 'Trebuchet',
    footerSpacing: 3
  };

  getS3object(event, function(err, msg) {
    if (err) return context.fail(err);
    else {
      var html = msg.Body.toString();
      wkhtmltopdf(html, options)
        .pipe(concat(function(buffer) {
          var key = uuid.v4();
          putS3object('look-ma-no-servers-output', key, buffer, 'application/pdf', function(err,data) {
            if (err) return context.fail(err)
            else return context.done(null, key);
          });
        }));
    }
  });
};

exports.handler = handler;
