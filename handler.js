'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');
const crypto = require('crypto');

const client = new DynamoDBClient({ region: 'us-east-2' });
const db = DynamoDBDocumentClient.from(client);
const tableName = process.env.NOTES_TABLE_NAME;

module.exports.createNote = async (event) => {
  const data = JSON.parse(event.body);
  const noteId = crypto.randomUUID();
  const params = {
    TableName: tableName,
    Item: {
      notesId: noteId,
      title: data.title,
      body: data.body,
    },
    ConditionExpression: 'attribute_not_exists(notesId)',
  };
  try {
    await db.send(new PutCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'A new note created',
        noteId,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

module.exports.updateNote = async (event) => {
  const noteId = event.pathParameters.id;
  const data = JSON.parse(event.body);
  const params = {
    TableName: tableName,
    Key: { notesId: noteId },
    UpdateExpression: 'SET #title = :title, #body = :body',
    ExpressionAttributeNames: {
      '#title': 'title',
      '#body': 'body',
    },
    ExpressionAttributeValues: {
      ':title': data.title,
      ':body': data.body,
    },
    ConditionExpression: 'attribute_exists(notesId)',
  };
  try {
    await db.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully updated the note',
        noteId,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

module.exports.deleteNote = async (event) => {
  const noteId = event.pathParameters.id;
  const params = {
    TableName: tableName,
    Key: { notesId: noteId },
    ConditionExpression: 'attribute_exists(notesId)',
  };
  try {
    await db.send(new DeleteCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `The note with id ${noteId} is deleted`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

module.exports.getAllNotes = async (event) => {
  const params = {
    TableName: tableName,
    Limit: 2, // Set limit to 2 for demonstration
  };
  let allItems = [];
  let lastEvaluatedKey = null;
  try {
    do {
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      } else {
        delete params.ExclusiveStartKey;
      }
      const data = await db.send(new ScanCommand(params));
      allItems = allItems.concat(data.Items || []);
      lastEvaluatedKey = data.LastEvaluatedKey;
      console.log(`Items retrieved: ${data.Items ? data.Items.length : 0}`);
    } while (lastEvaluatedKey);
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: allItems,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

module.exports.getNoteById = async (event) => {
  const noteId = event.pathParameters.id;
  const params = {
    TableName: tableName,
    Key: { notesId: noteId },
  };
  try {
    const data = await db.send(new GetCommand(params));
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Note not found',
        }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};
