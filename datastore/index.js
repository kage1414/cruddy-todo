const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let newFileName = id + '.txt';
    let newFilePath = path.join(exports.dataDir, newFileName);
    fs.writeFile(newFilePath, text, (err) => {
      if (err) {
        console.log('Error Creating Todo : ', err);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  // refactor this  to be a readdir
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let contents = _.map(data, (fileName) => {
        let id = fileName.slice(0, 5);
        let text = id;
        return {id, text};
      });
      callback(null, contents);
    }
  });
};

exports.readOne = (id, callback) => {
  let newFileName = id + '.txt';
  let newFilePath = path.join(exports.dataDir, newFileName);
  fs.readFile(newFilePath, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {

  exports.readOne(id, (err, data) => {
    let newFileName = id + '.txt';
    let newFilePath = path.join(exports.dataDir, newFileName);
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(newFilePath, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

};

exports.delete = (id, callback) => {
  let newFileName = id + '.txt';
  let newFilePath = path.join(exports.dataDir, newFileName);

  fs.rm(newFilePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
