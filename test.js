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
      modify: function (url, filePath) {
        return 'app/' + filePath + url;
      }
    });

    stream.on('data', function (file) {
      var expectedCss = ['body {\n',
                         '  background-image: url("app/./style.cssimages/logo.png");\n',
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

  it('should prepend url with string value', function (done) {
    var stream = modifyCssUrls({
      prepend: 'https://fancycdn.com/'
    });

    stream.on('data', function (file) {
      var expectedCss = ['body {\n',
                         '  background-image: url("https://fancycdn.com/images/logo.png");\n',
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

  it('should append url with string value', function (done) {
    var stream = modifyCssUrls({
      append: '?abcd1234'
    });

    stream.on('data', function (file) {
      var expectedCss = ['body {\n',
                         '  background-image: url("images/logo.png?abcd1234");\n',
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
