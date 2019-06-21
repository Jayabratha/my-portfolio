const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request-promise');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const path = require('path');
const os = require('os');
const elasticsearch = require('elasticsearch');
const cors = require('cors');
const corsFn = cors();

admin.initializeApp(functions.config().firebase);

const gcs = new Storage();
const db = admin.database();

const nodemailer = require('nodemailer');
const firebaseConfig = functions.config();
const gmailEmail = encodeURIComponent(firebaseConfig.gmail.email);
const gmailPassword = encodeURIComponent(firebaseConfig.gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

const elasticSearchConfig = firebaseConfig.elastic;

const esClient = new elasticsearch.Client({
  host: elasticSearchConfig.host,
  httpAuth: elasticSearchConfig.httpauth,
  log: 'trace'
});

//Send Contact Email
exports.sendContactMessage = functions.database.ref('/messages/{pushKey}').onWrite((snapshot) => {

  // Only send email for new messages.
  if (snapshot.before.val()) {
    return;
  }

  const val = snapshot.after.val();

  const mailOptions = {
    to: 'enjoy.jayabratha@gmail.com',
    subject: `Information Request from ${val.name}`,
    html: val.html
  };
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Mail sent to: enjoy.jayabratha@gmail.com');
  });
});

//Process Image upload to create thumbnail and DB entry
exports.processImgUploads = functions.storage.object().onFinalize((object) => {

  const bucket = gcs.bucket(object.bucket);
  const filePath = object.name;
  const fileName = filePath.split('/').pop();
  const fileNameSplit = fileName.split('.');
  const fileNameWithoutExtn = fileNameSplit[0];
  const fileExtn = fileNameSplit[1];
  const fileSize = object.size;
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const contentType = object.contentType;

  //If an art image is added make a file entry to DB and create a thumbnail
  if (contentType.startsWith('image/') && filePath.startsWith('artImages/')) {

    return bucket.file(filePath).download({
      destination: tempFilePath
    }).then(() => {
      //Create the thumbnail
      let newFileName = `${fileNameWithoutExtn}_thumb.${fileExtn}`;
      let newFileTemp = path.join(os.tmpdir(), newFileName);
      let newFilePath = `thumbs/${newFileName}`;
      let thumbPath = newFilePath;

      let imageFileObj = { fileName, filePath, thumbPath, fileSize, contentType };

      console.log(imageFileObj);

      db.ref('/artImages').push().set(imageFileObj);

      sharp(tempFilePath)
        .resize(null, 320)
        .toFile(newFileTemp, (err, info) => {

          bucket.upload(newFileTemp, {
            destination: newFilePath
          });
        });
    });
  } else {
    return false;
  }
});

//Process Image delete to remove thumbnail and DB entry
exports.processImgDelete = functions.storage.object().onDelete((object) => {
  const bucket = gcs.bucket(object.bucket);
  const filePath = object.name;
  const fileName = filePath.split('/').pop();
  const fileNameSplit = fileName.split('.');
  const fileNameWithoutExtn = fileNameSplit[0];
  const fileExtn = fileNameSplit[1];

  let thumbFilePath = `thumbs/${fileNameWithoutExtn}_thumb.${fileExtn}`;

  console.log(filePath);

  if (filePath.startsWith('artImages/')) {
    //Delete the thumbnail
    return bucket.file(thumbFilePath).delete().then(() => {
      console.log("Thumb removed successfully");
      //Delete DB entry
      let query = db.ref('/artImages').orderByChild("filePath").equalTo(filePath);
      query.once("value", function (snapshot) {
        console.log(snapshot);
        snapshot.forEach(function (child) {
          child.ref.remove();
        });
      });
    });
  } else {
    return false;
  }

})

//Update the Elasticsearch Index when image is uploaded
exports.updateImagesIndex = functions.database.ref('/artImages/{pushKey}').onWrite((snapshot, context) => {
  let postData, elasticSearchMethod = 'DELETE';
  const snapshotVal = snapshot.after.val();
  if (snapshotVal) {
    postData = {
      title: snapshotVal.title,
      desc: snapshotVal.desc,
      thumbPath: snapshotVal.thumbPath,
      type: 'Art'
    };
    elasticSearchMethod = 'POST';
  }
  let imageId = context.params.pushKey;
  let elasticSearchUrl = elasticSearchConfig.host + '/images/image/' + imageId;

  return request({
    method: elasticSearchMethod,
    url: elasticSearchUrl,
    auth: {
      username: elasticSearchConfig.user,
      password: elasticSearchConfig.password
    },
    body: postData,
    json: true
  }).then(response => {
    console.log(response);
  });
});

//Check if Elasticsearch server is avialable
exports.isSearchAvailable = functions.https.onRequest((request, response) => {
  corsFn(request, response, function () {
    esClient.ping({
      requestTimeout: 30000,
    }, function (error) {
      if (error) {
        console.error(error);
        response.send('elasticsearch cluster is down!');
      } else {
        response.send('All is well');
      }
    });
  });
});

//Search with keyword
exports.search = functions.https.onRequest((request, response) => {
  corsFn(request, response, function () {
    console.log(request.query.keyword);
    esClient.search({
      q: request.query.keyword
    }).then(function (resp) {
      var hits = resp.hits.hits;
      response.send(resp);
    }, function (err) {
      console.trace(err.message);
      response.send(err);
    });
  });
});
