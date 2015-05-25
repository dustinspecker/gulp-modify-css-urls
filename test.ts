'use strict';
import assert = require('assert');
import gutil = require('gulp-util');
import {modifyCssUrls} from './index';

describe('gulp-modify-css-urls', () => {
  var fileContents;

  beforeEach(() => {
    fileContents = ['body {\n',
                    '  background-image: url("images/logo.png");\n',
                    '}'].join('');
  });

  it('should not change anything in fileContents if no option set', (done) => {
    var stream = modifyCssUrls();

    stream.on('data', (file:gutil.File) => {
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

  it('should add app folder to CSS URL', (done) => {
    var stream = modifyCssUrls({
      modify: (url, filePath) => {
        return 'app/' + filePath + url;
      }
    });

    stream.on('data', (file:gutil.File) => {
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

  it('should prepend url with string value', (done) => {
    var stream = modifyCssUrls({
      prepend: 'https://fancycdn.com/'
    });

    stream.on('data', (file) => {
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

  it('should append url with string value', (done) => {
    var stream = modifyCssUrls({
      append: '?abcd1234'
    });

    stream.on('data', (file:gutil.File) => {
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
