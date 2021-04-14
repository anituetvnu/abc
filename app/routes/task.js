const express = require('express');

const { task: taskController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.post('/tasks', auth, taskController.addTask);
router.get('/tasks', auth, taskController.getTasks);
router.put('/tasks/:taskId', auth, taskController.updateTask);
router.delete('/tasks/:taskId', auth, taskController.removeTask);
router.get('/tasks/:taskId', auth, taskController.getTask);

module.exports = router;
