'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const groceryListMock = require('./lib/grocery-list-mock');

const API_URL = `http://localhost:${process.env.PORT}/api/grocery-list`;

describe('/api/grocery-list', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(groceryListMock.pCleanGroceryListMocks);

  // ----POST ROUTE TESTS------------------------------------------------------------------------
  // -----SUCCESS TEST------------------
  test('should respond with 200 status code and a new json note', () => {
    const originalRequest = {
      title: faker.lorem.words(2),
      content: faker.lorem.words(1),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((response) => {
        expect(response.status)
          .toEqual(200);
        expect(response.body.content)
          .toEqual(originalRequest.content);
        expect(response.body.title)
          .toEqual(originalRequest.title);

        expect(response.body.timestamp)
          .toBeTruthy();
        expect(response.body._id.toString())
          .toBeTruthy();
      });
  });
  // -----FAILURE TESTS------------------
  test('should respond with 400 status code if there is no title', () => {
    const originalRequest = {
      content: faker.lorem.words(1),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('should respond with 400 status code if there is no content', () => {
    const originalRequest = {
      title: faker.lorem.words(1),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  // -----GET ROUTE TESTS------------------------------------------------------------------------
  // -----SUCCESS TEST------------------------
  test('should respond with 200 status code and a json note if there is a matching id', () => {
    let savedGroceryListMock = null;
    return groceryListMock.pCreateGroceryListMock()
      .then((createdGroceryListMock) => {
        savedGroceryListMock = createdGroceryListMock;
        return superagent.get(`${API_URL}/${createdGroceryListMock._id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status)
          .toEqual(200);

        expect(getResponse.body.timestamp)
          .toBeTruthy();
        expect(getResponse.body._id.toString())
          .toEqual(savedGroceryListMock._id.toString());
        expect(getResponse.body.title)
          .toEqual(savedGroceryListMock.title);
      });
  });
  // ----------FAILURE TEST-----------------
  test('should respond with 404 if there isnt a matching id on a get route', () => {
    return superagent.get(`${API_URL}/jimbob`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status)
          .toEqual(400);
      });
  });

  // -----DELETE ROUTE TESTS---------------------------------------------------------------------
  test('should respond with 200 when grocery list is removed', () => {
    let savedGroceryListMock = null;
    return groceryListMock.pCreateGroceryListMock()
      .then((createdGroceryListMock) => {
        savedGroceryListMock = createdGroceryListMock;
        return superagent.delete(`${API_URL}/${createdGroceryListMock._id}`);
      })
      .then((deleteResponse) => {
        expect(deleteResponse.status)
          .toEqual(200);

        expect(deleteResponse.body.timestamp)
          .toBeTruthy();
        expect(deleteResponse.body._id.toString())
          .toEqual(savedGroceryListMock._id.toString());
        expect(deleteResponse.body.title)
          .toEqual(savedGroceryListMock.title);
      });
  });
  // ----------FAILURE TEST-----------------
  test('should respond with 404 if there isnt a matching id on a delete route', () => {
    return superagent.delete(`${API_URL}/jimbob`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status)
          .toEqual(400);
      });
  });

  // -----PUT ROUTE TESTS------------------------------------------------------------------------
  test('should respond with 204 if we updated a grocery lists title and content', () => {
    let savedGroceryListMock = null;
    return groceryListMock.pCreateGroceryListMock()
      .then((createdGroceryListMock) => {
        savedGroceryListMock = createdGroceryListMock;
        const newPut = {
          title: faker.lorem.words(1),
          content: faker.lorem.words(1),
        };
        return superagent.put(`${API_URL}/${createdGroceryListMock._id}`)
          .send(newPut)
          .then((putResponse) => {
            expect(putResponse.status)
              .toEqual(200);
            expect(putResponse.body._id)
              .toEqual(savedGroceryListMock.id);
            expect(putResponse.body.title)
              .toEqual(newPut.title);
            expect(putResponse.body.content)
              .toEqual(newPut.content);
          });
      });
  });
  // ----------FAILURE TEST-----------------
  test('should respond with 404 if there isnt a matching id on a put route', () => {
    return superagent.put(`${API_URL}/jimbob`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status)
          .toEqual(400);
      });
  });
  // test('should respond with 400 if we updated a grocery lists with no body', () => {
  //   return groceryListMock.pCreateGroceryListMock()
  //     .then((createdGroceryListMock) => {
  //       const newPut = {
  //       };
  //       return superagent.put(`${API_URL}/${createdGroceryListMock._id}`)
  //         .send(newPut)
  //         .then(Promise.reject)
  //         .catch((response) => {
  //           expect(response.status)
  //             .toEqual(400);
  //         });
  //     });
  // });
});
