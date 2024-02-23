import { useState, useEffect } from "react";
import { Appearance, StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { functions } from "./firebase";
import { HttpsCallable, httpsCallable } from "firebase/functions"

import CheckoutForm from "./CheckoutForm";


// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


// refer to : https://stripe.com/docs/payments/quickstart

type PaymentIntentServerResponse = {
  clientSecret: string,
}

const PaymentIntent = () => {

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const func: HttpsCallable<undefined, PaymentIntentServerResponse> = httpsCallable(functions, "createPaymentIntent");
    // const funcs : Functions = getFunctions(firebaseApp);

    // let url = "";
    // if ("emulatorOrigin" in functions) {
    //   url = `${functions.emulatorOrigin}/api/createPaymentIntent`;
    // } else {
    //   url = `${functions.customDomain}/api/createPaymentIntent`;
    // }
    func().then((response) => {
      console.log(JSON.stringify(response));
      setClientSecret(response.data.clientSecret);
    }
    );
  }, []);

  const appearance: Appearance = {
    theme: "stripe",
  };
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <div className="stripe-payment-intent">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
};

export default PaymentIntent;

