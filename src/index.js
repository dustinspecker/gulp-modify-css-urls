import applySourceMap from 'vinyl-sourcemaps-apply'
import PluginError from 'plugin-error'
import isFn from 'is-fn'
import rework from 'rework'
import reworkFunc from 'rework-plugin-function'
import through from 'through2'

/**
 * Transforms URLs in files
 * @param {String} filePath - path of CSS file that may be used by options.modify
 * @param {String} fileContents - contents of the file at filePath
 * @param {Boolean} sourcemap - is sourcemap enabled for this file?
 * @param {Object} [options={}] - rules for modifying URLs
 * @param {String} [options.append] - URLs are appended with this value
 * @param {Function} [options.modify] - This function is always called before append and prepend
 * @param {String} [options.prepend] - URLs are prepended with this value
 * @return {String} - transformed URL
 */
const modifyUrls = (filePath, fileContents, sourcemap, options = {}) => {
  const {append, modify, prepend} = options

  return rework(fileContents, {source: filePath})
    .use(reworkFunc({
      url(url) {
        /**
         * The split/join/trim logic is copied from rework-plugin-url to remove redundant quotes.
         * Currently removed due to: https://github.com/reworkcss/rework-plugin-url/issues/7
         */
        if (url.indexOf('data:') === 0) {
          return `url("${url}")`
        }

        let formattedUrl = url
          .split('"')
          .join('')
          .split('\'')
          .join('')
          .trim()

        if (isFn(modify)) {
          formattedUrl = modify(formattedUrl, filePath)
        }

        if (typeof prepend === 'string') {
          formattedUrl = prepend + formattedUrl
        }

        if (typeof append === 'string') {
          formattedUrl += append
        }

        return `url("${formattedUrl}")`
      }
    }, false))
    .toString({sourcemap, sourcemapAsObject: true})
}

/**
 * Pushes along files with transformed URLs
 * @param {Object} [options] - same as described for modifyUrls function
 * @return {Stream} - file with transformed URLs
 */
module.exports = options =>
  through.obj(function (file, enc, cb) {
    try {
      /* eslint no-invalid-this: 0 */
      const modifiedContents = modifyUrls(file.path, file.contents.toString(), file.sourceMap, options)

      if (file.sourceMap) {
        file.contents = Buffer.from(modifiedContents.code)
        modifiedContents.map.file = file.path
        applySourceMap(file, modifiedContents.map)
      } else {
        file.contents = Buffer.from(modifiedContents)
      }

      this.push(file)

      return cb()
    } catch (e) {
      return cb(new PluginError('modify-css-urls', e))
    }
  })
