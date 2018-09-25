[![Build Status](https://travis-ci.com/jlhiskey/code-challenge.svg?branch=master)](https://travis-ci.com/jlhiskey/11-14-express-api)
======
![cf](https://i.imgur.com/7v5ASc8.png) JavaScript-401d26
=======
## Express-API
 This application allows you to create, request, modify and delete entries in the grocery list api which stores your grocery list.

## Getting Started
- Fork this repository: https://github.com/jlhiskey/11-14-express-api.git
- Clone this repository onto your local device.
- The local repository should now contain a folder structure that matches the one shown below.
    - lib/ : contains module definitions
    - data/ : contains the text files used by the program
    - __tests__/ : contains unit tests
 - Now in your terminal you will need to install dependencies using 
the command:  npm i 
    - This will create a package.json file on your local device.
- To run test open your terminal use the command: npm run test

## Error Handling
- If users request doesn't contain a title or content then the application will send a 400 status.
- If user makes a request that isn't fullfilleable by the server then the application will send a 404 status.   

## Author 
- Jason Hiskey

## License 
- This project is licensed under the MIT License.
 
