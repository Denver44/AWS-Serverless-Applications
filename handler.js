'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  GetCommand,
} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);
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
    await ddbDocClient.send(new PutCommand(params));
    return send(201, data);
  } catch (error) {
    return send(500, JSON.stringify(error.message || 'Some error occurred!'));
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
    await ddbDocClient.send(new UpdateCommand(params));
    return send(200, data);
  } catch (error) {
    return send(500, JSON.stringify(error.message || 'Some error occurred!'));
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
    await ddbDocClient.send(new DeleteCommand(params));
    return send(
      200,
      JSON.stringify(`Note with id: ${notesId} deleted successfully!`)
    );
  } catch (error) {
    return send(500, JSON.stringify(error.message || 'Some error occurred!'));
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
    const data = await ddbDocClient.send(new GetCommand(params));
    return send(200, data);
  } catch (error) {
    return send(500, JSON.stringify(error.message || 'Some error occurred!'));
  }
};

module.exports.getAllNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false; // This is important for lambda to work properly

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
    };
    const data = await ddbDocClient.send(new ScanCommand(params));
    return send(200, data);
  } catch (error) {
    return send(500, JSON.stringify(error.message || 'Some error occurred!'));
  }
};
