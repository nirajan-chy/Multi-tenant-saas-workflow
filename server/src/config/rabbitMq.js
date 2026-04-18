const amqp = require("amqplib");

let channel;
exports.connectQueue = async () => {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue("task_queue");
  console.log("RabbitMq connected");
};

exports.getChannel = () => channel;
