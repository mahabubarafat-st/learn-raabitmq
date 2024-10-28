// src/consumers/taskConsumer.js
const amqp = require('amqplib');
const pool = require('../config/db'); // Ensure this file exports a MySQL pool instance
require('dotenv').config();

async function startConsumer() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('task_queue');

    console.log("Waiting for messages in task_queue");

    // Set up the consumer to process messages from the queue
    channel.consume('task_queue', async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());

        try {
          switch (data.type) {
            case 'create':
              await pool.query('INSERT INTO tasks (title, description) VALUES (?, ?)', [data.payload.title, data.payload.description]);
              console.log("Task created:", data.payload);
              break;
            case 'read':
              const [tasks] = await pool.query('SELECT * FROM tasks');
              console.log("Retrieved tasks:", tasks);
              break;
            case 'update':
              await pool.query('UPDATE tasks SET title = ?, description = ? WHERE id = ?', [data.payload.title, data.payload.description, data.payload.id]);
              console.log("Task updated:", data.payload);
              break;
            case 'delete':
              await pool.query('DELETE FROM tasks WHERE id = ?', [data.payload.id]);
              console.log("Task deleted with id:", data.payload.id);
              break;
            default:
              console.log("Unknown message type:", data.type);
          }
          // Acknowledge the message once processed
          channel.ack(msg);
        } catch (dbError) {
          console.error("Database operation failed:", dbError);
          // Optionally, you can reject the message if there's an error
          channel.nack(msg);
        }
      }
    });
  } catch (error) {
    console.error("Error in consumer:", error);
  }
}

startConsumer();
