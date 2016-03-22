// import config from '../config/index';
// const gravity = config.production.rootPath;
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports = function ingestionPrep(resolve, reject) {
  if (fs.existsSync('./test/staging')) {
    resolve = 'success';
    return resolve;
  } else { //eslint-disable-line
    fs.mkdir('./test/staging', (err) => {
      if (err) {
        return reject(err);
      } else { //eslint-disable-line
        resolve = 'success';
        return resolve;
      }
    });
  }
};
