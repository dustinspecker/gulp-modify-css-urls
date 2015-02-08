# gulp-modify-css-urls [![NPM version](https://badge.fury.io/js/gulp-modify-css-urls.svg)](http://badge.fury.io/js/gulp-modify-css-urls) [![Build Status](https://travis-ci.org/dustinspecker/gulp-modify-css-urls.svg)](https://travis-ci.org/dustinspecker/gulp-modify-css-urls) [![Coverage Status](https://img.shields.io/coveralls/dustinspecker/gulp-modify-css-urls.svg)](https://coveralls.io/r/dustinspecker/gulp-modify-css-urls?branch=master)
[![Dependencies](https://david-dm.org/dustinspecker/gulp-modify-css-urls.svg)](https://david-dm.org/dustinspecker/gulp-modify-css-urls/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/dustinspecker/gulp-modify-css-urls/dev-status.svg)](https://david-dm.org/dustinspecker/gulp-modify-css-urls/#info=devDependencies&view=table) [![PeerDependencies](https://david-dm.org/dustinspecker/gulp-modify-css-urls/peer-status.svg)](https://david-dm.org/dustinspecker/gulp-modify-css-urls/#info=peerDependencies&view=table)


> Gulp plugin for modifying CSS URLs

## Install
`npm install --save-dev gulp-modify-css-urls`

## Usage

```javascript
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
      modify: function (url) {
        return 'app/' + url;
      }
    }))
    .pipe(gulp.dest('./'));
});
```
/* style.css
body {
  background-image: url('app/images/logo.png');
}
*/

## License
MIT