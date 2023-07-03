# Slack Standup Echo

This project interacts with Slack API to fetch conversations (Daily Standup's) from GeekBot and send the conversation from the user as a threaded message to another . It also uses AWS Lambda, CloudWatch Events to schedule and trigger the Lambda function.

Zip the project files by running zip -r slack-conversation-fetcher.zip ./*.

Create an AWS Lambda function and upload the zip file.

Create a CloudWatch Events rule to schedule the Lambda function to run daily.
