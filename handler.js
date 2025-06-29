'use strict';

module.exports.createNote = async (event) => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'A new note created',
    }),
  };
};

module.exports.updateNote = async (event) => {
  const noteId = event.pathParameters.id;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `The note with id ${noteId} is updated`,
    }),
  };
};

module.exports.deleteNote = async (event) => {
  const noteId = event.pathParameters.id;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `The note with id ${noteId} is deleted`,
    }),
  };
};

module.exports.getAllNotes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'All notes are returned',
    }),
  };
};

module.exports.getNoteById = async (event) => {
  const noteId = event.pathParameters.id;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `The note with id ${noteId} is returned`,
    }),
  };
};
