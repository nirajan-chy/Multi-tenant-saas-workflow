const amqp = require("amqplib");

const startWorker = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("task_queue");

  console.log("Worker started ");

  channel.consume("task_queue", msg => {
    const data = JSON.parse(msg.content.toString());

    console.log("Received event:", data);

    if (data.type === "TASK_CREATED") {
      console.log(`Task ${data.taskId} created → sending email...`);
    }

    channel.ack(msg);
  });
};

startWorker();
