# Firebase + Stripe + Switchtbot on React + Vite


This is prototype web app using credit card payment using [Stripe](https://stripe.com/).

functionalities:

* credit card payment UI (using `@stripe/react-stripe-js`) 
* Stripe backend (using `stripe server-side library`) working on [Google firebase functions](https://firebase.google.com/docs/functions).
* As a result of payment, an interval timer starts (using [`Google Cloud Tasks`](https://cloud.google.com/tasks/docs?hl=ja)).
* While the interval timer actives, [Switchbot Plug min](https://www.switchbot.jp/products/switchbot-plug-mini) is changed to **On** state (using [swtichbot cloud api](https://github.com/OpenWonderLabs/SwitchBotAPI)).



# Related "Dashbords"

Web app working status can be seen in pages or apps below.

## Stripe payments
* [Stripe test payments](https://dashboard.stripe.com/test/payments)

## Firebase
* [Firebase console](https://console.firebase.google.com/)
  - **Realtime Database** (While interval timer is activated, some data in Realtime Database is **on** state)
  - **Functions** (Doing Stripe server process. Waiting for firing interval timer. Watching updates on Realtime Database)

## Google Tasks
* [Cloud task queue](https://console.cloud.google.com/cloudtasks)

## Switchbot
* [Android app](https://play.google.com/store/apps/details?id=com.theswitchbot.switchbot&hl=ja&gl=US)
* [iOS app](https://apps.apple.com/jp/app/switchbot/id1087374760)

