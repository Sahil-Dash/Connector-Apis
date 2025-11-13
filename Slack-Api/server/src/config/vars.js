module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  
  slack: {
    appId: process.env.SLACK_APP_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    redirectUri: process.env.SLACK_REDIRECT_URI,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  }
};
