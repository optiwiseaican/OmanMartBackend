const admin = require('firebase-admin');
const serviceAccount = require('../arabic-kk-ol-0021-firebase-adminsdk-747lm-be37ef95ed.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // You can also provide your service account key file as follows:
  // credential: admin.credential.cert(require('./path/to/serviceAccountKey.json'))
});

module.exports = admin;
