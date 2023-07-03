const AWS = require('aws-sdk');
const { WebClient, LogLevel } = require('@slack/web-api');
require('dotenv').config();

// Create an AWS Lambda function handler
exports.handler = async (event, context) => {
  // Initialize AWS SDK
  AWS.config.update({ region: process.env.AWS_REGION });

  // Require Slack API token and channel ID from environment variables
  const slackApiToken = process.env.SLACK_API_TOKEN;
  const slackChannelId = process.env.SLACK_CHANNEL_ID;
  const slackUserId = process.env.SLACK_USER_ID;
  const slackAppId = process.env.SLACK_APP_ID;
  const slackIntegrationChannelId = process.env.SLACK_DISC_HEALTH_CLAIMS_CHANNEL_ID;

  // Initialize Slack WebClient with Slack API token
  const client = new WebClient(slackApiToken, {
    logLevel: LogLevel.INFO
  });

  const fetchConversations = async () => {
    try {
      // Call the conversations.history method using WebClient
      const result = await client.conversations.history({
        channel: slackChannelId,

      });

      // Filter messages based on the user ID
      const conversationHistory = result.messages.filter(message => message.app_id === slackAppId);
      return conversationHistory;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessageUserData = (conversations) => {
    const messages = conversations.filter(conversation => conversation.type === "message");
    const currentDate = new Date(); // Get current date
    const filteredMessages = messages.filter(message => {
      const messageDate = new Date(message.ts * 1000); // Convert timestamp to date object
      return messageDate.toDateString() === currentDate.toDateString(); // Compare message date with current date
    }).map(message => {
      return {
        text: message.text,
        username: message.username,
        icons: message.icons ? message.icons.image_48 : '',
        ts: message.ts,
        attachments: message.attachments,
      }
    });
    return filteredMessages;
  };

  // Post a message to a channel with attachments
  const publishMessage = async (channelID, attachments, username, icon_url, text, thread) => {
    try {
      // Call the chat.postMessage method using the built-in WebClient
      const result = await client.chat.postMessage({
        channel: channelID,
        text: text,
        icon_url: icon_url,
        attachments: attachments,
        username: username,
        thread_ts: thread
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const publishThread = async (channelID) => {
    try {

      const today = new Date().getDay();
      if (today === 0 || today === 6) {
        console.log("Today is not a workday");
        return;
      }

      //Formatting Date
      const date = new Date();
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      const text = `*The Avengers Standup on ${formattedDate}*`;

      // Call the chat.postMessage method using the built-in WebClient
      const result = await client.chat.postMessage({
        channel: channelID,
        // text: "The Avengers Standup on " + new Date().toLocaleDateString(),
        text: text,
        mrkdwn: true
      });
      // Print result, which includes information about the message (like TS)
      console.log("Thread Response", result);
      return result.ts;
    } catch (error) {
      console.error(error);
    }
  };

  const conversations = await fetchConversations();

  const messages = await fetchMessageUserData(conversations);

  const thread = await publishThread(slackIntegrationChannelId);

  for (const message of messages.reverse()) {
    console.log("Message", message);
    await publishMessage(slackIntegrationChannelId, message.attachments, message.username, message.icons, message.text, thread);
  }
};
