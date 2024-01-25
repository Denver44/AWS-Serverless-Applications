'use strict';

module.exports.createNote = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify('Note created successfully!'),
  };
};

module.exports.updateNote = async (event) => {
  const { id } = event.pathParameters;
  return {
    statusCode: 200,
    body: JSON.stringify(`Note with id: ${id} updated successfully!`),
  };
};

module.exports.deleteNote = async (event) => {
  const { id } = event.pathParameters;
  return {
    statusCode: 200,
    body: JSON.stringify(`Note with id: ${id} deleted successfully!`),
  };
};

module.exports.getNote = async (event) => {
  const { id } = event.pathParameters;
  return {
    statusCode: 200,
    body: JSON.stringify(`Note with id: ${id} fetched successfully!`),
  };
};

module.exports.getAllNote = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify('All notes fetched successfully!'),
  };
};
