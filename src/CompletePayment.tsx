import { HttpsCallable, httpsCallable } from "@firebase/functions";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { functions } from "./firebase";

const CompletePayment = () => {
  const [serverResponse, setServerResponse] = useState("");
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);

    const payment_intent = params.get("payment_intent");
    const payment_intent_client_secret = params.get("payment_intent_client_secret")
    const redirect_status = params.get("redirect_status")

    console.log({
      payment_intent,
      payment_intent_client_secret,
      redirect_status
    })

    const func: HttpsCallable<any, any> = httpsCallable(functions, "onPaymentCompleted");
    func({
      payment_intent,
      payment_intent_client_secret,
      redirect_status
    }).then((r) => {
      console.log("onPaymentCompleted returned  - " + r.data);
      setServerResponse(r.data.status);
    })

  }, [search]);

  return (
    <>
      {(serverResponse == "ok") ?
        (<h1>payment has been completed!</h1>) :
        (<h1>something wrong!</h1>)}
      <br />
      <div>{serverResponse}</div>
      <br />
      <div>
        <a href="/">Back to "Top" page</a>
      </div>
    </>
  )
}

export default CompletePayment;
