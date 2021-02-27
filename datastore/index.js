const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId()
    .then((id) => {
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





  //   (err, id) => {
  //   let newFileName = id + '.txt';
  //   let newFilePath = path.join(exports.dataDir, newFileName);
  //   fs.writeFile(newFilePath, text, (err) => {
  //     if (err) {
  //       console.log('Error Creating Todo : ', err);
  //     } else {
  //       callback(null, { id, text });
  //     }
  //   });
  // });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let promiseArray = _.map(data, (file) => {
        return new Promise((resolve, reject) => {
          let filepath = path.join(exports.dataDir, file);
          fs.readFile(filepath, 'utf8', (err, fileContents) => {
            if (err) {
              reject(err);
            } else {
              let id = file.slice(0, 5);
              let text = fileContents;
              resolve({id, text});
            }
          });
        });
      });
      Promise.all(promiseArray)
        .then ((contents) => {
          callback(null, contents);
        })
        .catch ((err) => {
          console.log('there was an error... ', err);
        });
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
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
