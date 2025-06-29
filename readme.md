# Notes CRUD API

A serverless REST API for managing notes, built with AWS Lambda, API Gateway, and the Serverless Framework.

## 🏗️ Architecture

This application uses:

- **AWS Lambda** - Serverless compute for API functions
- **API Gateway** - REST API endpoints
- **Serverless Framework** - Infrastructure as Code deployment

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 18 or higher)
2. **AWS CLI** configured with your credentials
3. **Serverless Framework** installed globally:

   ```bash
   npm install -g serverless
   ```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure AWS Credentials

Ensure your AWS credentials are configured. You can do this by:

```bash
aws configure
```

Or by setting environment variables:

```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1
```

### 3. Deploy to AWS

Deploy the entire stack to AWS:

```bash
sls deploy
```

After successful deployment, you'll see the API endpoints in the output.

### 4. Test the API

Test the hello endpoint:

```bash
curl https://your-api-gateway-url/dev/hello
```

## 📁 Project Structure

```text
notes-crud-api/
├── handler.js          # Lambda function handlers
├── serverless.yml      # Serverless Framework configuration
├── package.json        # Node.js dependencies and scripts
└── readme.md          # This file
```

## 🔧 Available Scripts

- `npm run sls` - Run serverless commands
- `serverless deploy` - Deploy the application to AWS
- `serverless remove` - Remove the deployed stack from AWS
- `serverless logs -f hello` - View function logs

## 📝 API Endpoints

| Method | Endpoint | Description   |
| ------ | -------- | ------------- |
| GET    | /hello   | Test endpoint |

## 🛠️ Development

### Local Development

To run functions locally:

```bash
serverless invoke local -f hello
```

### Viewing Logs

To view logs for a specific function:

```bash
serverless logs -f hello -t
```

## 🚮 Cleanup

To remove all deployed resources:

```bash
serverless remove
```

## 📖 Learn More

- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)

---

**Note**: This is part of the "Complete Guide to Build Serverless Applications on AWS" course.
