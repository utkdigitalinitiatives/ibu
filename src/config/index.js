
const path = require('path');
// const rootPath = path.normalize(__dirname + '/test/');
// const rootPath = path.normalize('./test/');
const rootPath = './test/delivery';
// const rootPath = path.normalize('./test');
module.exports = {
  development: {
    rootPath,
    database: 'mongodb://localhost/express-todo',
    port: process.env.PORT || 3000,
  },
  production: {
    rootPath,
    database: 'mongodb://jasonshark:multivision@ds037478.mongolab.com:37478/multivision',
    port: process.env.PORT || 80,
  },
};
