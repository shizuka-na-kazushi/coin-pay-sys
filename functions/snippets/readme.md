
# How to use

To execute createTask.js, set environment variable first:

```bach
export GOOGLE_APPLICATION_CREDENTIALS=/Users/kazushi/Works/coin-pay-sys/functions/src/firebase-adminsdk-service-account.json
```

Before executing command below, service account in above json shall have appropriate permission to create new task. It can be done in [Cloud task console](https://console.cloud.google.com/cloudtasks?hl=ja&project=coin-pay-sys).


And then, execute:

```bach
node createTask.js
```

It'll create new default task.

Let's see it in google could console at [queue detail page](https://console.cloud.google.com/cloudtasks/queue/us-central1/coinboxtimer/tasks?hl=ja&project=coin-pay-sys)!
