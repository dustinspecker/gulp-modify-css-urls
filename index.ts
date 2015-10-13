'use strict';
import gutil = require('gulp-util');
import through = require('through2');

const isFn = require('is-fn');
const rework = require('rework');
const reworkUrl = require('rework-plugin-url');

export function modifyCssUrls(options?: modifyCssUrls.Options):modifyCssUrls.Stream {
   options = options || {};

  return through.obj(function (file: gutil.File, enc: string, cb: () => void): void {
    const modifiedContents = modifyUrls(file.path, file.contents.toString(), options);

    file.contents = new Buffer(modifiedContents);

    this.push(file);

    cb();
  });
}

function modifyUrls(filePath: string, fileContents: string, options: modifyCssUrls.Options): string {
  return rework(fileContents)
    .use(reworkUrl((url: string): string => {
      if (isFn(options.modify))
        url = options.modify(url, filePath);

      if (typeof options.prepend === 'string') {
        url = options.prepend + url;
      }

      if (typeof options.append === 'string') {
        url = url + options.append;
      }

      return url;
    })).toString();
}
