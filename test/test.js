/* global describe, beforeEach, it */
'use strict'
import assert from 'assert'
import gutil from 'gulp-util'

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

    stream.write(new gutil.File({
      base: '.',
      path: './style.css',
      contents: new Buffer(fileContents)
    }))

    stream.end()
  })

  it('should add app folder to CSS URL', done => {
    stream = modifyCssUrls({
      modify: (url, filePath) => `app/${filePath}${url}`
    })

    stream.on('data', file => {
      const expectedCss = [
        'body {\n',
        '  background-image: url("app/./style.cssimages/logo.png");\n',
        '}'
      ].join('')

      assert(file.contents.toString() === expectedCss)
      done()
    })

    stream.write(new gutil.File({
      base: '.',
      path: './style.css',
      contents: new Buffer(fileContents)
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

    stream.write(new gutil.File({
      base: '.',
      path: './style.css',
      contents: new Buffer(fileContents)
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

    stream.write(new gutil.File({
      base: '.',
      path: './style.css',
      contents: new Buffer(fileContents)
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

    stream.write(new gutil.File({
      base: '.',
      path: './style.css',
      contents: new Buffer(fileContentsWithDataURI)
    }))

    stream.end()
  })
})
