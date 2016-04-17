# gulp-modify-css-urls
[![NPM version](https://badge.fury.io/js/gulp-modify-css-urls.svg)](http://badge.fury.io/js/gulp-modify-css-urls)
[![Build Status](https://travis-ci.org/dustinspecker/gulp-modify-css-urls.svg?branch=master)](https://travis-ci.org/dustinspecker/gulp-modify-css-urls)
[![Coverage Status](https://img.shields.io/coveralls/dustinspecker/gulp-modify-css-urls.svg)](https://coveralls.io/r/dustinspecker/gulp-modify-css-urls?branch=master)

[![Dependencies](https://david-dm.org/dustinspecker/gulp-modify-css-urls.svg)](https://david-dm.org/dustinspecker/gulp-modify-css-urls/#info=dependencies&view=table)
[![DevDependencies](https://david-dm.org/dustinspecker/gulp-modify-css-urls/dev-status.svg)](https://david-dm.org/dustinspecker/gulp-modify-css-urls/#info=devDependencies&view=table)
[![PeerDependencies](https://david-dm.org/dustinspecker/gulp-modify-css-urls/peer-status.svg)](https://david-dm.org/dustinspecker/gulp-modify-css-urls/#info=peerDependencies&view=table)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Gulp plugin for modifying CSS URLs

## Install
`npm install --save-dev gulp-modify-css-urls`

## Usage

### ES2015

```javascript
/* gulpfile.babel.js */
import gulp from 'gulp';
import modifyCssUrls from 'gulp-modify-css-urls';

/* style.css
body {
  background-image: url('images/logo.png');
}
*/
gulp.task('modifyUrls', () =>
  gulp.src('style.css')
    .pipe(modifyCssUrls({
      modify(url, filePath) {
        return `app/${url}`;
      },
      prepend: 'https://fancycdn.com/',
      append: '?cache-buster'
    }))
    .pipe(gulp.dest('./'))
);
/* style.css
body {
  background-image: url('https://fancycdn.com/app/images/logo.png?cache-buster');
}
*/
```

### ES5

```javascript
/* gulpfile.js */
var gulp = require('gulp')
  , modifyCssUrls = require('gulp-modify-css-urls');

/* style.css
body {
  background-image: url('images/logo.png');
}
*/
gulp.task('modifyUrls', function () {
  return gulp.src('style.css')
    .pipe(modifyCssUrls({
      modify: function (url, filePath) {
        return 'app/' + url;
      },
      prepend: 'https://fancycdn.com/',
      append: '?cache-buster'
    }))
    .pipe(gulp.dest('./'));
});
/* style.css
body {
  background-image: url('https://fancycdn.com/app/images/logo.png?cache-buster');
}
*/
```

## Options
### modify 
A function that is passed the current URL and file path and then returns the modified URL to replace the existent URL.

**The modify function is always ran *before* append and prepend options.**

### append
A string that is appended to every URL.

### prepend
A string that is prepended to every URL.

## License
MIT
