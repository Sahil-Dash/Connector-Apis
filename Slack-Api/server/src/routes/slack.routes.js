const express = require('express');
const slackController = require('../controller/slack.controller');

const router = express.Router();

// OAuth callback
router.get('/slack/oauth/callback', slackController.handleCallback);

// API endpoints
router.post('/slack/send-message', slackController.sendMessage);
router.post('/slack/channels', slackController.getChannels);
router.post('/slack/messages', slackController.getMessages); 

module.exports = router;
