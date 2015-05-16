'use strict';
import through = require('through2');
import gutil = require('gulp-util');

var rework = require('rework');
var reworkUrl = require('rework-plugin-url');

export function modifyCssUrls(options?: modifyCssUrls.options):modifyCssUrls.Stream {
   options = options || {};

  return through.obj(function (file: gutil.File, enc: string, cb: () => void) {
    var modifiedContents = modifyUrls(file.path, file.contents.toString(), options);

    file.contents = new Buffer(modifiedContents);

    this.push(file);

    cb();
  });
}

function modifyUrls(filePath: string, fileContents: string, options: modifyCssUrls.options) {
  return rework(fileContents)
    .use(reworkUrl(function (url: string) {
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
