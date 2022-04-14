var MarkdownIt = require('markdown-it')
var raw = require('choo/html/raw')

var md = new MarkdownIt({
  html: true,
  breaks: true
})
md.use(require('markdown-it-footnote'))

function format (str) {
  str = str || ''
  return raw(md.render(str))
}

module.exports = format
