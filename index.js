'use strict';
var rework = require('rework')
  , reworkUrl = require('rework-plugin-url')
  , through = require('through2');

function modifyUrls(fileContents, options) {
  return rework(fileContents)
    .use(reworkUrl(function (url) {
      if (typeof options.modify !== 'function') {
        return url;
      }

      return options.modify(url);
    })).toString();
}

module.exports = function (options) {
  options = options || {};

  return through.obj(function (file, enc, cb) {
    var modifiedContents = modifyUrls(file.contents.toString(), options);

    file.contents = new Buffer(modifiedContents);

    this.push(file);

    cb();
  });
};
