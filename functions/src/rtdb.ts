
import { db } from "./fb";
import { CoinBoxId } from "./inc";

/**
 * @class {RtDb}
 */
class RtDb {
  /**
   * 
   * @param {CoinBoxId} id  : indicator for the coin-box 
   * @param {string} clientSecret  : PaymentIntent id
   * @param {number} intervalInSeconds ( in seconds ) 
   */
  async startProcess(id: CoinBoxId, clientSecret: string, intervalInSeconds: number): Promise<boolean> {
    const ref = db.ref(`coinbox/${id}`);

    try {
      const result = await ref.transaction((current) => {
        if (current && current.status === "on") {
          return; // abort transaction.
        }

        return {
          status: "on",
          payment_info: clientSecret,
          timer_interval: intervalInSeconds,
        };
      });
      return Promise.resolve(result.committed);
    } catch (e) {
      console.error("realtime db transaction failed.");
      return Promise.resolve(false);
    }
  }

  /**
   * 
   * @param {CoinBoxId} id 
   * @return {Promise<boolean>}
   */
  async endProcess(id: CoinBoxId) : Promise<boolean> {
    const ref = db.ref(`coinbox/${id}`);

    try {
      await ref.transaction(() => {
        return {
          status: "off",
          payment_info: "",
          timer_interval: -1,
        };
      });
      return Promise.resolve(true);
    } catch (e) {
      console.error("realtime db transaction for endProcess failed.");
      return Promise.resolve(false);
    }
  }
}


export default RtDb;
