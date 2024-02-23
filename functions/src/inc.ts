
export const cfg = {
  projectId: process.env.COIN_PAY_SYS_PROJECT_ID,
  taskQueueName: process.env.COIN_PAY_SYS_QUEUE_NAME,
  taskHandlerUrl: process.env.COIN_PAY_SYS_TASK_HANDLER_URL,
  location: process.env.COIN_PAY_SYS_QUEUE_REGION,
};

export type CoinBoxId = string;
