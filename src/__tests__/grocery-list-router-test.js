'use strict';

process.env.PORT = 3000;

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');

const API_URL = `http://localhost:${process.env.PORT}/api/grocery-list`;

describe('/api/grocery-list', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  // ----POST ROUTE TESTS------------------------------------------------------------------------
  // -----SUCCESS TEST------------------
  test('should respond with 200 status code and a new json note', () => {
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Jason Grocery',
        content: 'Ham',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.content).toEqual('Ham');
        expect(response.body.title).toEqual('Jason Grocery');
        expect(response.body.timestamp).toBeTruthy();
        expect(response.body.id).toBeTruthy();
      });
  });
  // -----FAILURE TESTS
  test('should respond with 400 status code if there is no title', () => {
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send({
        content: 'Ham',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('should respond with 400 status code if there is no content', () => {
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Jason Grocery',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  // -----GET ROUTE TESTS--------------------------------------------------------------------------
  test('should respond with 200 status code and a json note if there is a matching id', () => {
    const originalRequest = {
      title: faker.lorem.words(5),
      content: faker.lorem.words(5),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((postResponse) => {
        originalRequest.id = postResponse.body.id;
        return superagent.get(`${API_URL}/${postResponse.body.id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body.id).toEqual(originalRequest.id);
        expect(getResponse.body.title).toEqual(originalRequest.title);
      });
  });

  // -----DELETE ROUTE TESTS-----------------------------------------------------------------------
  test('should respond with 204 when grocery list is removed', () => {
    const originalRequest = {
      title: faker.lorem.words(5),
      content: faker.lorem.words(5),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((postResponse) => {
        originalRequest.id = postResponse.body.id;
        return superagent.delete(`${API_URL}/${postResponse.body.id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(204);
      });
  });

  test('should respond with 404 if there is no grocery list to remove', () => {
    return superagent.delete(`${API_URL}/jeff-bezos`)
      .then(Promise.reject)
      .catch((getResponse) => {
        expect(getResponse.status).toEqual(404);
      });
  });

  // -----PUT ROUTE TESTS--------------------------------------------------------------------------
  test('should respond with 204 if we updated a grocery list', () => {
    const originalRequest = {
      title: faker.lorem.words(5),
      content: faker.lorem.words(5),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((postResponse) => {
        originalRequest.id = postResponse.body.id;
        return superagent.put(`${API_URL}/${postResponse.body.id}`)
          .send({
            title: 'Vinicio Grocery List',
          });
      })
      .then((putResponse) => {
        expect(putResponse.status).toEqual(200);
        expect(putResponse.body.id).toEqual(originalRequest.id);

        expect(putResponse.body.title).toEqual('Vinicio Grocery List');
        expect(putResponse.body.content).toEqual(originalRequest.content);
      });
  });
  test('should respond with 404 if there is no grocery list to update', () => {
    return superagent.put(`${API_URL}/jeff-bezos`)
      .then(Promise.reject)
      .catch((getResponse) => {
        expect(getResponse.status).toEqual(404);
      });
  });
});
