const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////


//Thisfunction will have to create a new file every time it is passed a new todo
//  eachfile it makes will be named with it's unique ID
//  its contents will be the text contents that it is passedwhen it is invoked.

//Input - the parameter 'text' will be a string that the user writes in the client, ie. "make pancakes".  Callback is what is provided by server. In this case, a successfulPOST request will send us a callback that will return id and text to the client.
//OUtput - create a file with filename of id and body will be 'text'
//c/e - ??
exports.create = (text, callback) => {
  let id;
  counter.getNextUniqueId((err, num) => {
    id = num;
    //console.log('dataDir: ', exports.dataDir);
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err, () => {
      if (err) {
        console.log('error writing file');
      } else {
        callback(null, { id, text });
      }
    }));
  });
  //this is asynchronous so ID is not immediately updated
  //items[id] = text;
  //console.log(items);

};

// fs.readdir(pathname, callback)
//callback willbe invoked with (err, [data])




exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      console.log('error reading all files');
    } else {
      callback(null, data.map((item) => { return {'id': item.slice(0, 5), 'text': item.slice(0, 5) }; }));
    }
  });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
