const axios = require('axios');
const { slack } = require('../config/vars');

class SlackService {
  constructor() {
    this.baseURL = 'https://slack.com/api';
  }

  async getAccessToken(code) {
    const params = new URLSearchParams();
    params.append('client_id', slack.clientId);
    params.append('client_secret', slack.clientSecret);
    params.append('code', code);
    params.append('redirect_uri', slack.redirectUri);

    const { data } = await axios.post(`${this.baseURL}/oauth.v2.access`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return data;
  }

  // Send message to channel
  async sendMessage(accessToken, channel, text) {
    const { data } = await axios.post(
      `${this.baseURL}/chat.postMessage`,
      {
        channel,
        text,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return data;
  }

  // Get list of channels
  async getChannels(accessToken) {
    const { data } = await axios.get(`${this.baseURL}/conversations.list`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        types: 'public_channel,private_channel',
        limit: 100,
      },
    });

    return data;
  }
}

module.exports = new SlackService();
