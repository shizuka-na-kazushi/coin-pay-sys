import { CoinBoxId, cfg } from "./inc";

/**
 * @class CoinTask
 */
export default class CoinTask {
  url: string | undefined;

  /**
   * 
   * @param {string} handlerUrl 
   */
  constructor(handlerUrl: string | undefined) {
    /** @property {string} url */
    this.url = handlerUrl;
  }

  /**
   * 
   * @param {CoinBoxId} id 
   * @param {number} intervalInSeconds 
   * @return {Promise<void>}
   */
  async startTimer(id: CoinBoxId, intervalInSeconds: number): Promise<void> {
    // Imports the Google Cloud Tasks library.
    /* eslint-disable-next-line */ 
    const { CloudTasksClient } = require('@google-cloud/tasks');

    // Instantiates a client.
    const client = new CloudTasksClient();

    // Construct the fully qualified queue name.
    const parent = client.queuePath(cfg.projectId, cfg.location, cfg.taskQueueName);

    const payload = JSON.stringify({
      coinBoxId: id,
    });

    const task = {
      httpRequest: {
        httpMethod: "POST",
        url: this.url,
        headers: {
          "Content-Type": "application/json",
        },
        body: Buffer.from(payload).toString("base64"),
      },
      scheduleTime: {
        seconds: intervalInSeconds + Date.now() / 1000,
      },
    };

    console.log("Sending task:");
    console.log(task);

    try {
      // Send create task request.
      const request = { parent: parent, task: task };
      const [response] = await client.createTask(request);
      const name = response.name;
      console.log(`Created task ${name}`);
    } catch (e: any) {
      console.error(e.message);
      return Promise.reject(e);
    }

    return Promise.resolve();
  }
}
