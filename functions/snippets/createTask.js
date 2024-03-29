// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var env = require("./env");

// sample-metadata:
//   title: Cloud Tasks Create App Engine Target
//   description: Create Cloud Tasks with a Google App Engine Target
//   usage: node createTask.js <projectId> <queueName> <location> <payload> <delayInSeconds>

/**
 * Create a task for a given queue with an arbitrary payload.
 */
function main(
  project = 'my-project-id', // GCP Project id (same as firebase project id)
  queue = 'coinboxtimer', // Name of the Queue I created on console.
  location = 'us-central1', // The GCP region of the queue
  payload = '{message: "Hello, World!"}', // The task HTTP request body
  url = "http://localhost:8000/handler",  // Tekito-
  inSeconds = 60 // Delay in task execution
) {
  // [START cloud_tasks_appengine_create_task]
  // Imports the Google Cloud Tasks library.
  const {CloudTasksClient} = require('@google-cloud/tasks');

  // Instantiates a client.
  const client = new CloudTasksClient();

  async function createTask() {
    // TODO(developer): Uncomment these lines and replace with your values.
    const project = env.firebase.projectId;
    // const queue = 'my-appengine-queue';
    // const location = 'us-central1';
    // const payload = 'Hello, World!';

    // Construct the fully qualified queue name.
    const parent = client.queuePath(project, location, queue);

    const task = {
      httpRequest: {
        httpMethod: 'POST',
        url,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    };

    if (payload) {
      task.httpRequest.body = Buffer.from(payload).toString('base64');
    }

    if (inSeconds) {
      // The time when the task is scheduled to be attempted.
      task.scheduleTime = {
        seconds: inSeconds + Date.now() / 1000,
      };
    }

    console.log('Sending task:');
    console.log(task);

    // Send create task request.
    const request = {parent: parent, task: task};
    const [response] = await client.createTask(request);
    const name = response.name;
    console.log(`Created task ${name}`);
  }

  createTask();
  // [END cloud_tasks_appengine_create_task]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main(...process.argv.slice(2));