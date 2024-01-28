'use strict';

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
    stringKey: 'stringval',
    numberKey: 123,
    booleanKey: true,
  };
  console.log(JSON.stringify(authResponse));
  return authResponse;
};

exports.handler = async (event, context, callback) => {
  // lambda authorizer function

  var token = event.authorizationToken; // "allow" or "deny" are the only two options

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
