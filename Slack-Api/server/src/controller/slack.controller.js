//--------------------(No BOT TOKEN USAGE)--------------------//

const SlackService = require('../services/slack.service');

class SlackController {
    async handleCallback(req, res) {
        try {
            const { code, error } = req.query;

            // Check for errors
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'OAuth denied',
                    error,
                });
            }

            if (!code) {
                return res.status(400).json({
                    success: false,
                    message: 'No authorization code received',
                });
            }

            // Exchange code for token
            const tokenData = await SlackService.getAccessToken(code);

            if (!tokenData.ok) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to get access token',
                    error: tokenData.error,
                });
            }

            // Extract USER token (not bot token)
            const userToken = tokenData.authed_user?.access_token;
            const userId = tokenData.authed_user?.id;

            console.log('✅ Slack connected successfully!');
            console.log('User Token:', userToken);
            console.log('User ID:', userId);
            console.log('Team:', tokenData.team?.name);

            res.json({
                success: true,
                message: 'Successfully connected to Slack!',
                data: {
                    accessToken: userToken, // USER token (xoxp-)
                    userId: userId,
                    team: tokenData.team,
                    scope: tokenData.authed_user?.scope,
                },
            });
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.status(500).json({
                success: false,
                message: 'OAuth callback failed',
                error: error.message,
            });
        }
    }

    // Send a message
    async sendMessage(req, res) {
        try {
            const { accessToken, channel, text } = req.body;

            if (!accessToken || !channel || !text) {
                return res.status(400).json({
                    success: false,
                    message: 'accessToken, channel, and text are required',
                });
            }

            const result = await SlackService.sendMessage(accessToken, channel, text);

            if (!result.ok) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to send message',
                    error: result.error,
                });
            }

            res.json({
                success: true,
                message: 'Message sent successfully!',
                data: result,
            });
        } catch (error) {
            console.error('Send message error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send message',
                error: error.message,
            });
        }
    }

    // Get channels
    async getChannels(req, res) {
        try {
            const { accessToken } = req.body;

            if (!accessToken) {
                return res.status(400).json({
                    success: false,
                    message: 'accessToken is required',
                });
            }

            const result = await SlackService.getChannels(accessToken);

            if (!result.ok) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to get channels',
                    error: result.error,
                });
            }

            res.json({
                success: true,
                message: 'Channels retrieved successfully!',
                data: result.channels,
            });
        } catch (error) {
            console.error('Get channels error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get channels',
                error: error.message,
            });
        }
    }

    // Get messages from a channel
    async getMessages(req, res) {
        try {
            const { accessToken, channel } = req.body;

            if (!accessToken || !channel) {
                return res.status(400).json({
                    success: false,
                    message: 'accessToken and channel are required',
                });
            }

            const result = await SlackService.getMessages(accessToken, channel);

            if (!result.ok) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to get messages',
                    error: result.error,
                });
            }

            res.json({
                success: true,
                message: 'Messages retrieved successfully!',
                data: result.messages,
            });
        } catch (error) {
            console.error('Get messages error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get messages',
                error: error.message,
            });
        }
    }
}

module.exports = new SlackController();
