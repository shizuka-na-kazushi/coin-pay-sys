
////////////////////////////////////////////////////////////////////////////////////////
// firebase (realtime database) codes
////////////////////////////////////////////////////////////////////////////////////////

var admin = require("firebase-admin");
var env = require('./env');

// Fetch the service account key JSON file contents
var serviceAccount = require("../src/firebase-adminsdk-service-account.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: env.firebase.databaseURL,
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("coinbox/coinbox-1");
ref.on("value", function (snapshot) {
  const data = snapshot.val();
  console.log(data);

  changePlugState(data.status == "on");
});

////////////////////////////////////////////////////////////////////////////////////////
// Swtichbot codes
////////////////////////////////////////////////////////////////////////////////////////

const crypto = require('crypto');

const token = env.switchbot.token;
const secret = env.switchbot.secret;


const baseUrl = 'https://api.switch-bot.com'

const mydevices = env.switchbot.devices;

const changePlugState = (enable) => {

  const url = baseUrl + `/v1.1/devices/${mydevices.plug.deviceId}/commands`
  const method = 'POST'

  const body = JSON.stringify({
    command: enable ? 'turnOn' : 'turnOff',
    parameter: 'default',
    commandType: 'command'
  })

  const t = Date.now();
  const nonce = crypto.randomUUID()
  const data = token + t + nonce;
  const signTerm = crypto.createHmac('sha256', secret).update(Buffer.from(data, 'utf-8')).digest();
  const sign = signTerm.toString("base64");

  fetch(url, {
    method: method,
    headers: {
      "Authorization": token,
      "sign": sign,
      "nonce": nonce,
      "t": t,
      'Content-Type': 'application/json',
      'Content-Length': body.length,
    },
    body: body,
  }).then((r) => r.json()).then((json) => {
    console.log(`------ plug command (${enable ? 'on' : 'off'}) (deviceId: ${mydevices.plug.deviceId}) -----`)
    console.log(JSON.stringify(json, null, ' '))
  })
}