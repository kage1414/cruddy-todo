const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');

// var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const readCounterAsync = Promise.promisify(readCounter);

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

const writeCounterAsync = Promise.promisify(writeCounter);

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = new Promise((resolve, reject) => {
  return readCounterAsync()
    .then ((count) => {
      count = count + 1;
      writeCounterAsync(count);
    })
    .then ((counterString) => {
      resolve(counterString);
    });
});



// (callback) => {

//   readCounter((err, count) => {


//     writeCounter(count, (err, counterString) => {
//       callback(null, counterString);
//     });
//   });

// };

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
