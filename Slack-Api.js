const express = require('express');
const axios = require('axios');

// ===================================
// SLACK CREDENTIALS
// ===================================
const SLACK_CONFIG = {
  appId: 'A09SS48RNDS',
  clientId: '9902986678389.9910144872468',
  clientSecret: '626004eb630db3011c43a193f7191e04',
  signingSecret: 'e90e2d56b37ead29c3152280ee5c9aaf',
  redirectUri: 'https://01467056c705fb.lhr.life/api/slack/oauth/callback'
};

const USER_SCOPES = [
  'channels:read',
  'channels:history',
  'groups:read',
  'groups:history',
  'im:read',
  'im:history',
  'chat:write',
  'users:read'
].join(',');

const PORT = 5000;

// ===================================
// EXPRESS APP
// ===================================
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===================================
// HOME PAGE
// ===================================
app.get('/', (req, res) => {
  res.send(`
    <h1>Slack OAuth Test Server</h1>
    <p>Server running on port ${PORT}</p>
    <h3>Endpoints:</h3>
    <ul>
      <li>GET /auth-token - Start OAuth flow</li>
      <li>POST /api/slack/channels - Get channels</li>
      <li>POST /api/slack/send-message - Send message</li>
      <li>POST /api/slack/messages - Get messages</li>
    </ul>
  `);
});

// ===================================
// START OAUTH FLOW (Redirect to Slack)
// ===================================
app.get('/auth-token', (req, res) => {
  const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CONFIG.clientId}&user_scope=${USER_SCOPES}&redirect_uri=${encodeURIComponent(SLACK_CONFIG.redirectUri)}`;
  res.redirect(authUrl);
});

// ===================================
// OAUTH CALLBACK (Get Access Token)
// ===================================
app.get('/api/slack/oauth/callback', async (req, res) => {
  try {
    const { code, error } = req.query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'OAuth denied',
        error
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'No authorization code received'
      });
    }

    // Exchange code for token
    const params = new URLSearchParams();
    params.append('client_id', SLACK_CONFIG.clientId);
    params.append('client_secret', SLACK_CONFIG.clientSecret);
    params.append('code', code);
    params.append('redirect_uri', SLACK_CONFIG.redirectUri);

    const { data } = await axios.post('https://slack.com/api/oauth.v2.access', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (!data.ok) {
      return res.status(400).json({
        success: false,
        message: 'Failed to get access token',
        error: data.error
      });
    }

    // Extract USER token
    const userToken = data.authed_user?.access_token;
    const userId = data.authed_user?.id;

    console.log('✅ Slack connected successfully!');
    console.log('User Token:', userToken);
    console.log('User ID:', userId);

    res.json({
      success: true,
      message: 'Successfully connected to Slack!',
      data: {
        accessToken: userToken,
        userId: userId,
        team: data.team,
        scope: data.authed_user?.scope
      }
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({
      success: false,
      message: 'OAuth callback failed',
      error: error.message
    });
  }
});

// ===================================
// GET CHANNELS
// ===================================
app.post('/api/slack/channels', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'accessToken is required'
      });
    }

    const { data } = await axios.get('https://slack.com/api/conversations.list', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      params: {
        types: 'public_channel,private_channel',
        limit: 100
      }
    });

    if (!data.ok) {
      return res.status(400).json({
        success: false,
        message: 'Failed to get channels',
        error: data.error
      });
    }

    res.json({
      success: true,
      message: 'Channels retrieved successfully!',
      data: data.channels
    });
  } catch (error) {
    console.error('Get channels error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get channels',
      error: error.message
    });
  }
});

// ===================================
// SEND MESSAGE
// ===================================
app.post('/api/slack/send-message', async (req, res) => {
  try {
    const { accessToken, channel, text } = req.body;

    if (!accessToken || !channel || !text) {
      return res.status(400).json({
        success: false,
        message: 'accessToken, channel, and text are required'
      });
    }

    const { data } = await axios.post(
      'https://slack.com/api/chat.postMessage',
      { channel, text },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!data.ok) {
      return res.status(400).json({
        success: false,
        message: 'Failed to send message',
        error: data.error
      });
    }

    res.json({
      success: true,
      message: 'Message sent successfully!',
      data: data
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// ===================================
// GET MESSAGES
// ===================================
app.post('/api/slack/messages', async (req, res) => {
  try {
    const { accessToken, channel } = req.body;

    if (!accessToken || !channel) {
      return res.status(400).json({
        success: false,
        message: 'accessToken and channel are required'
      });
    }

    const { data } = await axios.get('https://slack.com/api/conversations.history', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      params: { channel, limit: 100 }
    });

    if (!data.ok) {
      return res.status(400).json({
        success: false,
        message: 'Failed to get messages',
        error: data.error
      });
    }

    res.json({
      success: true,
      message: 'Messages retrieved successfully!',
      data: data.messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages',
      error: error.message
    });
  }
});

// ===================================
// START SERVER
// ===================================
app.listen(PORT, () => {
  console.log(`\n🚀 Server: http://localhost:${PORT}`);
  console.log(`🔗 Get Token: http://localhost:${PORT}/auth-token\n`);
});
