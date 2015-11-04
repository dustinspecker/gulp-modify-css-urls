'use strict';
import isFn from 'is-fn';
import rework from 'rework';
import reworkUrl from 'rework-plugin-url';
import through from 'through2';

function modifyUrls(filePath, fileContents, options) {
  return rework(fileContents)
    .use(reworkUrl(url => {
      if (isFn(options.modify)) {
        url = options.modify(url, filePath);
      }

      if (typeof options.prepend === 'string') {
        url = options.prepend + url;
      }

      if (typeof options.append === 'string') {
        url += options.append;
      }

      return url;
    })).toString();
}

module.exports = function (options = {}) {
  return through.obj(function (file, enc, cb) {
    const modifiedContents = modifyUrls(file.path, file.contents.toString(), options);

    file.contents = new Buffer(modifiedContents);

    this.push(file);

    cb();
  });
};
