'use strict';

const superagent = require('superagent');
const server = require('../lib/server');
const groceryListItemMock = require('./lib/grocery-list-item-mock');

const API_URL = `http://localhost:${process.env.PORT}/api/grocery-list-item`;

describe('/api/grocery-list-item', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(groceryListItemMock.pCleanGroceryListItemMocks);


  test('PUT should respond with 200 status and an updated item', () => {
    let savedGroceryListMock;
    return groceryListItemMock.pCreateGroceryListMock()
      .then((mock) => {
        savedGroceryListMock = mock;
        return superagent.put(`${API_URL}/${mock.groceryListItem._id}`)
          .send({
            title: 'I am the updated title',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.content).toEqual(savedGroceryListMock.groceryListItem.content);
        expect(response.body.title).toEqual('I am the updated title');
        expect(response.body.groceryList.toString())
          .toEqual(savedGroceryListMock.groceryList._id.toString());
      });
  });
  // test('DELETE should respond with 200 status and an updated item', () => {
  //   let savedGroceryListMock;
  //   return groceryListItemMock.pCreateGroceryListMock()
  //     .then((mock) => {
  //       savedGroceryListMock = mock;
  //       return superagent.delete(`${API_URL}/${mock.groceryListItem._id}`);
  //     })
  //     .then((response) => {
  //       expect(response.status)
  //         .toEqual(200);
  //       expect(response.body._id.to())
  //         .toEqual(savedGroceryListMock._id.toString());
  //       expect(response.body.title)
  //         .toEqual(savedGroceryListMock.title);
  //       expect(response.body.groceryList.toString())
  //         .toEqual(savedGroceryListMock.groceryList._id.toString());
  //     });
  // });
});
