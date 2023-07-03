# Slack Standup Echo

This project interacts with Slack API to fetch conversations (Daily Standup's) from GeekBot and send the conversation from the user as a threaded message to another Slack channel and schedule it using AWS Lambda and EventBridge scheduled events. The Lambda function is triggered daily to execute the code and send the information to a designated Slack channel.

## Prerequisites

Before running the code, make sure you have the following prerequisites set up:

AWS account with appropriate permissions to create Lambda functions and EventBridge rules.

Slack workspace with administrative access to create a new app and generate API tokens.

## Usage

Once the setup is complete, the Lambda function will be triggered daily based on the configured schedule. It will fetch the desired information from the Slack API and send it as a threaded message in the designated Slack channel.

You can customize the code in the handler.js file to fetch and format the information according to your requirements. The example code retrieves data from the Slack API, but you can modify it to interact with other APIs as needed.
