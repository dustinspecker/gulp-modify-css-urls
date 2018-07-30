/* global describe, beforeEach, it */
import assert from 'assert'
import gulp from 'gulp'
import gFile from 'gulp-file'
import Vinyl from 'vinyl'
import PluginError from 'plugin-error'
import sourcemaps from 'gulp-sourcemaps'

import modifyCssUrls from '../lib'

describe('gulp-modify-css-urls', () => {
  let fileContents, stream

  beforeEach(() => {
    fileContents = [
      'body {\n',
      '  background-image: url("images/logo.png");\n',
      '}'
    ].join('')
  })

  it('should not change anything in fileContents if no option set', done => {
    stream = modifyCssUrls()

    stream.on('data', file => {
      assert(file.contents.toString() === fileContents)
      done()
    })

    stream.write(new Vinyl({
      base: '.',
      path: './style.css',
      contents: Buffer.from(fileContents)
    }))

    stream.end()
  })

  it('should return error when file has invalid CSS and not pass file through', done => {
    stream = modifyCssUrls()

    stream.on('data', () => {
      assert(false)
    })

    stream.on('error', error => {
      assert(error instanceof PluginError)
      assert(error.plugin === 'modify-css-urls')
      done()
    })

    stream.write(new Vinyl({
      base: '.',
      path: './style.css',
      contents: Buffer.from('invalid css')
    }))

    stream.end()
  })

  it('should support sourcemaps when enabled', done => {
    let originalSourcemap

    stream = gulp.src([])
      .pipe(gFile('./style.css', fileContents))
      .pipe(sourcemaps.init())
      .on('data', file => {
        originalSourcemap = file.sourceMap
      })
      .pipe(modifyCssUrls({
        modify: (url, filePath) => `app/${filePath}${url}`
      }))
      .on('data', file => {
        assert(file.sourceMap !== originalSourcemap)
      })
      .pipe(sourcemaps.write())

    stream.on('finish', () => {
      done()
    })

    stream.write(new Vinyl({
      base: '.',
      path: './style.css',
      contents: Buffer.from(fileContents)
    }))
  })

  it('should add app folder to CSS URL', done => {
    stream = modifyCssUrls({
      modify: (url, filePath) => `app/${filePath}${url}`
    })

    stream.on('data', file => {
      const expectedCss = [
        'body {\n',
        '  background-image: url("app/style.cssimages/logo.png");\n',
        '}'
      ].join('')

      assert(file.contents.toString() === expectedCss)
      done()
    })

    stream.write(new Vinyl({
      base: '.',
      path: './style.css',
      contents: Buffer.from(fileContents)
    }))

    stream.end()
  })

  it('should prepend url with string value', done => {
    stream = modifyCssUrls({
      prepend: 'https://fancycdn.com/'
    })

    stream.on('data', file => {
      const expectedCss = [
        'body {\n',
        '  background-image: url("https://fancycdn.com/images/logo.png");\n',
        '}'
      ].join('')

      assert(file.contents.toString() === expectedCss)
      done()
    })

    stream.write(new Vinyl({
      base: '.',
      path: './style.css',
      contents: Buffer.from(fileContents)
    }))

    stream.end()
  })

  it('should append url with string value', done => {
    stream = modifyCssUrls({
      append: '?abcd1234'
    })

    stream.on('data', file => {
      const expectedCss = [
        'body {\n',
        '  background-image: url("images/logo.png?abcd1234");\n',
        '}'
      ].join('')

      assert(file.contents.toString() === expectedCss)
      done()
    })

    stream.write(new Vinyl({
      base: '.',
      path: './style.css',
      contents: Buffer.from(fileContents)
    }))

    stream.end()
  })

  it('should not modify data uris', done => {
    const fileContentsWithDataURI = [
      'body {\n',
      '  background-image: url("data:image/png;base64,iVBORw");\n',
      '}'
    ].join('')

    stream = modifyCssUrls({
      append: '?abcd1234'
    })

    stream.on('data', file => {
      assert(file.contents.toString() === fileContentsWithDataURI)
      done()
    })

    stream.write(new Vinyl({
      base: '.',
      path: './style.css',
      contents: Buffer.from(fileContentsWithDataURI)
    }))

    stream.end()
  })

  it('should not strip quotes from data uris', done => {
    const fileContentsWithDataURI = [
      'body {\n',
      '  background-image: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'></svg>");\n',
      '}'
    ].join('')

    stream = modifyCssUrls({
      append: '?abcd1234'
    })

    stream.on('data', file => {
      assert(file.contents.toString() === fileContentsWithDataURI)
      done()
    })

    stream.write(new Vinyl({
      base: '.',
      path: './style.css',
      contents: Buffer.from(fileContentsWithDataURI)
    }))

    stream.end()
  })
})
