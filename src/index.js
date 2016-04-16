'use strict'
import isFn from 'is-fn'
import rework from 'rework'
import reworkUrl from 'rework-plugin-url'
import through from 'through2'

/**
 * Transforms URLs in files
 * @param {String} filePath - path of CSS file that may be used by options.modify
 * @param {String} fileContents - contents of the file at filePath
 * @param {Object} [options={}] - rules for modifying URLs
 * @param {String} [options.append] - URLs are appended with this value
 * @param {Function} [options.modify] - This function is always called before append and prepend
 * @param {String} [options.prepend] - URLs are prepended with this value
 * @return {String} - transformed URL
 */
const modifyUrls = (filePath, fileContents, options = {}) => {
  const {append, modify, prepend} = options

  return rework(fileContents)
    .use(reworkUrl(url => {
      let formattedUrl = url

      if (formattedUrl.indexOf('data:') === 0) {
        return formattedUrl
      }

      if (isFn(modify)) {
        formattedUrl = modify(formattedUrl, filePath)
      }

      if (typeof prepend === 'string') {
        formattedUrl = prepend + formattedUrl
      }

      if (typeof append === 'string') {
        formattedUrl += append
      }

      return formattedUrl
    }))
    .toString()
}

/**
 * Pushes along files with transformed URLs
 * @param {Object} [options] - same as described for modifyUrls function
 * @return {Stream} - file with transformed URLs
 */
module.exports = options =>
  through.obj(function (file, enc, cb) {
    /* eslint no-invalid-this: 0 */
    const modifiedContents = modifyUrls(file.path, file.contents.toString(), options)

    file.contents = new Buffer(modifiedContents)

    this.push(file)

    cb()
  })
