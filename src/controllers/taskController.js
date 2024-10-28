// src/controllers/taskController.js
const { publishToQueue } = require('../publisher/rabbitmq');

exports.createTask = (req, res) => {
  const { title, description } = req.body;
  publishToQueue({ type: 'create', payload: { title, description } });
  res.status(202).json({ message: 'Task creation initiated' });
};

exports.getTasks = (req, res) => {
  publishToQueue({ type: 'read' });
  res.status(202).json({ message: 'Task retrieval initiated' });
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  publishToQueue({ type: 'update', payload: { id, title, description } });
  res.status(202).json({ message: 'Task update initiated' });
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;
  publishToQueue({ type: 'delete', payload: { id } });
  res.status(202).json({ message: 'Task deletion initiated' });
};
