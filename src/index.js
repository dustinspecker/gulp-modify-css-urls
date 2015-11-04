'use strict';
import isFn from 'is-fn';
import rework from 'rework';
import reworkUrl from 'rework-plugin-url';
import through from 'through2';

/**
 * Transforms URLs in files
 * @param {String} filePath - path of CSS file that may be used by options.modify
 * @param {String} fileContents - contents of the file at filePath
 * @param {Object} [options] - rules for modifying URLs
 * @param {String} [options.append] - URLs are appended with this value
 * @param {Function} [options.modify] - This function is always called before append and prepend.
 * @param {String} [options.prepend] - URLs are prepended with this value
 * @return {String} - transformed URL
 */
function modifyUrls(filePath, fileContents, options) {
  return rework(fileContents)
    .use(reworkUrl(url => {
      if (url.indexOf('data:') === 0) {
        return url;
      }

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

/**
 * Pushes along files with transformed URLs
 * @param {Object} options - same as described for modifyUrls function
 * @return {Stream} - file with transformed URLs
 */
module.exports = function (options = {}) {
  return through.obj(function (file, enc, cb) {
    const modifiedContents = modifyUrls(file.path, file.contents.toString(), options);

    file.contents = new Buffer(modifiedContents);

    this.push(file);

    cb();
  });
};
