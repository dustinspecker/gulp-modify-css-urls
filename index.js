'use strict';
var rework = require('rework')
  , reworkUrl = require('rework-plugin-url')
  , through = require('through2');

function modifyUrls(filePath, fileContents, options) {
  return rework(fileContents)
    .use(reworkUrl(function (url) {
      if (typeof options.modify === 'function') {
        url = options.modify(url, filePath);
      }

      if (typeof options.prepend === 'string') {
        url = options.prepend + url;
      }

      if (typeof options.append === 'string') {
        url = url + options.append;
      }

      return url;
    })).toString();
}

module.exports = function (options) {
  options = options || {};

  return through.obj(function (file, enc, cb) {
    var modifiedContents = modifyUrls(file.path, file.contents.toString(), options);

    file.contents = new Buffer(modifiedContents);

    this.push(file);

    cb();
  });
};
