const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const nodemailer = require('nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);
const db = admin.database();

exports.sendContactMessage = functions.database.ref('/messages/{pushKey}').onWrite(event => {
  const snapshot = event.data;
  // Only send email for new messages.
  if (snapshot.previous.val() || !snapshot.val().name) {
    return;
  }

  const val = snapshot.val();

  const mailOptions = {
    to: 'enjoy.jayabratha@gmail.com',
    subject: `Information Request from ${val.name}`,
    html: val.html
  };
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Mail sent to: enjoy.jayabratha@gmail.com');
  });
});

exports.updateImageList = functions.storage.object().onChange(event => {
  const object = event.data;
  const filePath = object.name;
  const fileName = filePath.split('/').pop();
  const fileSize = object.size;
  const contentType = object.contentType;
  const resourceState = object.resourceState;
  const metageneration = object.metageneration;

  imageFileObj = {fileName, filePath, fileSize, contentType};

  console.log(imageFileObj);

  // Exit if this is a move or deletion event.
  if (resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  }

  // Exit if file exists but is not new and is only being triggered
  // because of a metadata change.
  if (resourceState === 'exists' && metageneration > 1) {
    console.log('This is a metadata change event.');
    return;
  }

  //If an art image is added make a file entry to DB
  if (contentType.startsWith('image/') && filePath.startsWith('artImages/')) {
    db.ref('/artImages').push().set(imageFileObj);
    return;
  }
})
