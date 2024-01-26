'use strict';
const DynamoDB = require('aws-sdk/clients/dynamodb');
const documentClient = new DynamoDB.DocumentClient({
  region: 'us-east-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 5000,
  },
});

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, body) => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

module.exports.createNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false; // This is important for lambda to work properly
  const data = JSON.parse(event.body);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body,
      },
      conditionExpression: 'attribute_not_exists(noteId)',
    };
    await documentClient.put(params).promise();
    cb(null, send(201, data));
  } catch (error) {
    cb(
      null,
      send(500, JSON.stringify(error.message || 'Some error occurred!'))
    );
  }
};

module.exports.updateNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false; // This is important for lambda to work properly

  const notesId = event.pathParameters.id;
  const data = JSON.parse(event.body);

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
      UpdateExpression: 'set #title = :title, #body = :body',

      ExpressionAttributeNames: {
        '#title': 'title',
        '#body': 'body',
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':body': data.body,
      },
      conditionExpression: 'attribute_exists(notesId)',
    };
    await documentClient.update(params).promise();
    cb(null, send(200, data));
  } catch (error) {
    cb(
      null,
      send(500, JSON.stringify(error.message || 'Some error occurred!'))
    );
  }
};

module.exports.deleteNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false; // This is important for lambda to work properly

  const notesId = event.pathParameters.id;

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
      conditionExpression: 'attribute_exists(notesId)',
    };
    await documentClient.delete(params).promise();
    cb(
      null,
      send(
        200,
        JSON.stringify(`Note with id: ${notesId} deleted successfully!`)
      )
    );
  } catch (error) {
    cb(
      null,
      send(500, JSON.stringify(error.message || 'Some error occurred!'))
    );
  }
};

module.exports.getNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false; // This is important for lambda to work properly

  const notesId = event.pathParameters.id;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
    };
    const data = await documentClient.get(params).promise();
    cb(null, send(200, data));
  } catch (error) {
    cb(
      null,
      send(500, JSON.stringify(error.message || 'Some error occurred!'))
    );
  }
};

module.exports.getAllNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false; // This is important for lambda to work properly

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
    };
    const data = await documentClient.scan(params).promise();
    cb(null, send(200, data));
  } catch (error) {
    cb(
      null,
      send(500, JSON.stringify(error.message || 'Some error occurred!'))
    );
  }
};
