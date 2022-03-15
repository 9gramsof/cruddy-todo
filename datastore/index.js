const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////


//Thisfunction will have to create a new file every time it is passed a new todo
//  eachfile it makes will be named with it's unique ID
//  its contents will be the text contents that it is passedwhen it is invoked.

//Input - the parameter 'text' will be a string that the user writes in the client, ie. "make pancakes".  Callback is what is provided by server. In this case, a successfulPOST request will send us a callback that will return id and text to the client.
//OUtput - create a file with filename of id and body will be 'text'
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      fs.writeFile(path.join(exports.dataDir), '00000.txt'), text, (err) => {
        if (err) {
          console.log('error writing first file');
        } else {
          callback(null, { id, text });
        }
      };
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          console.log('error writing file');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};


exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      console.log('error reading all files');
    } else {
      let todos = data.map((item) => {
        var filepath = path.join(exports.dataDir, item);
        var id = path.basename(item, '.txt');
        return readFilePromise(filepath).then(fileText => {
          console.log('fileText', fileText.toString());
          return {
            'id': id,
            'text': fileText.toString()
          };
        });
      });
      Promise.all(todos)
        .then(items => callback(null, items), err => callback(err));
    }

  // [{id: '00001', text: 'make pancakes'}, ]
  });
};

exports.readOne = (id, callback) => {

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {'id': id, 'text': fileData.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
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
  fs.rm(path.join(exports.dataDir, `${id}.txt`), (err) => {
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
