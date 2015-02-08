/* global describe, beforeEach, it */
'use strict';
var assert = require('assert')
  , gutil = require('gulp-util')
  , modifyCssUrls = require('./');

describe('gulp-modify-css-urls', function () {
  var fileContents;

  beforeEach(function () {
    fileContents = ['body {\n',
                    '  background-image: url("images/logo.png");\n',
                    '}'].join('');
  });

  it('should not change anything in fileContents if no option set', function (done) {
    var stream = modifyCssUrls();

    stream.on('data', function (file) {
      assert(file.contents.toString() === fileContents);
      done();
    });

    stream.write(new gutil.File({
      base: '.',
      path: './style.css',
      contents: new Buffer(fileContents)
    }));

    stream.end();
  });

  it('should add app folder to CSS URL', function (done) {
    var stream = modifyCssUrls({
      modify: function (url) {
        return 'app/' + url;
      }
    });

    stream.on('data', function (file) {
      var expectedCss = ['body {\n',
                         '  background-image: url("app/images/logo.png");\n',
                         '}'].join('');
      assert(file.contents.toString() === expectedCss);
      done();
    });

    stream.write(new gutil.File({
      base: '.',
      path: './style.css',
      contents: new Buffer(fileContents)
    }));

    stream.end();
  });
});
