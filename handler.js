'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Welcome to AWS Serverless Applications!',
      },
      null,
      2
    ),
  };
};
