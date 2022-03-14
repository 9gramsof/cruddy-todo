const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

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

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      //console.log('counter file is: ', exports.counterFile);
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
//read the pathname(how to get hte pathname?)
//write to the pathname

  //getthe current counter by invoking readCounter
  readCounter((err, data) => {
    if (err) {
      callback(null, 0);
      // console.log('error reading data');
    } else {
      counter = data + 1;
      writeCounter(counter, (err, counterString) => {
        if (err) {
          console.log('error writing data');
        } else {
          // return (counterString);
          callback(null, zeroPaddedNumber(counter));
        }
      });
    }
  });

  //update counter.txt with writeCounter


  //readCOunter should check for an error first.
  //  if error
  //    then IDK
  //otherwise
  //update counter,increment counter,invoke writeCounter

  // return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
