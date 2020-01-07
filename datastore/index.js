const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    const filename = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filename, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      var data = _.map(files, (filename) => {
        return {
          id: filename.substring(0, 5),
          text: filename.substring(0, 5)
        };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  const filename = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filename, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  const filename = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filename, 'utf8', (err, originalText) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(filename, text, (err) => {
        if (err) {
          callback(err);
        }
        callback(null, { id, text });
      });
    }
  });
};

exports.delete = (id, callback) => {
  const filename = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(filename, (err) => {
    if (err) {
      console.log('DELETE failed');
      callback(err);
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
