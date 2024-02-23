
/* eslint-disable-next-line */
const nodeCrypto = require("node:crypto");


const token = process.env.COIN_PAY_SYS_SWITCHBOT_TOKEN;
const secret = process.env.COIN_PAY_SYS_SWITCHBOT_SECRET;
const baseUrl = "https://api.switch-bot.com";

const changePlugState = (enable: boolean) => { 
  if (!secret || !token) {
    console.error("need to define process.env.COIN_PAY_SYS_SWITCHBOT_*!");
    return;
  }

  const url = baseUrl + `/v1.1/devices/${process.env.COIN_PAY_SYS_SWITCHBOT_DEVICE_ID}/commands`;
  const method = "POST";

  const body = JSON.stringify({
    command: enable ? "turnOn" : "turnOff",
    parameter: "default",
    commandType: "command",
  });

  const t = Date.now();
  const nonce = nodeCrypto.randomUUID();
  const data = token + t + nonce;
  const signTerm = nodeCrypto.createHmac("sha256", secret).update(Buffer.from(data, "utf-8")).digest();
  const sign = signTerm.toString("base64");

  const headers : HeadersInit = {
    "Authorization": token,
    "sign": sign,
    "nonce": nonce,
    "t": String(t),
    "Content-Type": "application/json",
    "Content-Length": String(body.length),
  };

  fetch(url, {
    method: method,
    headers,
    body: body,
  }).then((r) => r.json()).then((json) => {
    console.log(`------ plug command (${enable ? "on" : "off"}) (deviceId: ${process.env.COIN_PAY_SYS_SWITCHBOT_DEVICE_ID}) -----`);
    console.log(JSON.stringify(json, null, " "));
  });
};

export const Switchbot = {
  changePlugState, 
};
