// src/app.js
const express = require('express');
const taskRoutes = require('./routes/tasks');
const { connectRabbitMQ } = require('./publisher/rabbitmq');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/tasks', taskRoutes);

connectRabbitMQ();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
