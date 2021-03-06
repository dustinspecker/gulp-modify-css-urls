'use strict'
import babel from 'gulp-babel'
import del from 'del'
import gulp from 'gulp'
import eslint from 'gulp-eslint'
import istanbul from 'gulp-istanbul'
import mocha from 'gulp-mocha'

const configFiles = './gulpfile.babel.js'
const srcFiles = 'src/*.js'
const testFiles = 'test/*.js'

const destDir = './lib/'

gulp.task('clean', () => del(destDir))

gulp.task('lint', ['clean'], () =>
  gulp.src([configFiles, srcFiles, testFiles])
    .pipe(eslint())
    .pipe(eslint.failOnError())
)

gulp.task('compile', ['lint'], () =>
  gulp.src(srcFiles)
    .pipe(babel())
    .pipe(gulp.dest(destDir))
)

gulp.task('build', ['compile'])

gulp.task('test', ['build'], cb => {
  gulp.src([`${destDir}*.js`])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src([testFiles])
        .pipe(mocha({
          compilers: {
            js: 'js:babel-core/register'
          }
        }))
        .pipe(istanbul.writeReports())
        .on('end', cb)
    })
})
