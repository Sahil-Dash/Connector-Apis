require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { port } = require('./config/vars');
const slackRoutes = require('./routes/slack.routes');

/**
 * Express instance
 * @public
 */
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Slack OAuth Server 🚀</h1>
    <p>Server is running successfully!</p>
    <h3>Available Endpoints:</h3>
    <ul>
      <li>GET /api/slack/oauth/callback - OAuth callback</li>
      <li>POST /api/slack/send-message - Send message</li>
      <li>POST /api/slack/channels - Get channels list</li>
    </ul>
  `);
});

app.use('/api', slackRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
