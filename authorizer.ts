import { CognitoJwtVerifier } from 'aws-jwt-verify';
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_USER_POOL_WEB_CLIENT_ID =
  process.env.COGNITO_USER_POOL_WEB_CLIENT_ID;

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: 'id',
  clientId: COGNITO_USER_POOL_WEB_CLIENT_ID,
});

// This is IAM policy, not lambda policy so it will have mandatory fields like Version, Statement, Action, Effect, Resource
//  To check the response of an IAM Policy go to IAM -> Policies -> And check code of any policy under Permissions tab
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {
    principalId, // This can be any thing like user, admin, etc
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke', // Here we are allowing the user to invoke the API so action is execute-api:Invoke
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };

  // This is context which will be passed to the lambda function
  // So after checking the token and if it is valid then we can pass some data to the lambda function
  // like user data or any other data which can be used in the lambda function
  authResponse.context = {
    foo: 'bar',
  };
  return authResponse;
};

module.exports.handlerV2 = async (event, context, callback) => {
  const token = event.authorizationToken;
  try {
    await jwtVerifier.verify(token);
    callback(null, generatePolicy('user', 'Allow', event.methodArn));
  } catch (error) {
    callback('Error: Invalid token ');
  }
};

module.exports.handler = async (event, context, callback) => {
  // lambda authorizer function
  const token = event.authorizationToken; // "allow" or "deny" are the only two options
  switch (token) {
    case 'allow':
      callback(null, generatePolicy('user', 'Allow', event.methodArn));
      break;
    case 'deny':
      callback(null, generatePolicy('user', 'Deny', event.methodArn));
      break;

    default:
      callback('Error: Invalid token ');
      break;
  }
};
