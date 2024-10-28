// src/publisher/rabbitmq.js
const amqp = require('amqplib');
require('dotenv').config();

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('task_queue');
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
  }
}

function publishToQueue(data) {
  if (!channel) return;
  channel.sendToQueue('task_queue', Buffer.from(JSON.stringify(data)));
  console.log("Message sent to task_queue:", data);
}

module.exports = { connectRabbitMQ, publishToQueue };
