var fs = require('fs')
var path = require('path')
var app = require('./app')
var ncp = require('ncp').ncp
var dedent = require('dedent')
var browserify = require('browserify')
var nanohtml = require('nanohtml')

var TEMPLATE = dedent`
<!DOCTYPE HTML>
<html lang="en">
	<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="preload" href="/assets/index.css" as="style">
    <link href="/assets/index.css" rel="stylesheet">

    %%HEAD%%
  </head>
  %%BODY%%
</html>
`

var SCRIPT = '<script src="/assets/index.js" defer></script>'

function bundleHTML() {
  var state = {}
  var body = app.toString('/', state)

  var head = dedent`
    <title>${state.title}</title>
    ${Object.keys(state.meta).map(function (key) {
      var attribute = key.substr(0, 3) === 'og:' ? 'property' : 'name'
      return '<meta ' + attribute + '="' + key + '" content="' + state.meta[key] + '" >'
    }).join('\n')}

    <script>window.initialState = ${JSON.stringify(state)}</script>
  `
  var html = TEMPLATE.replace('%%BODY%%', body).replace('%%HEAD%%', head)
  html = html.replace('</body>', `${SCRIPT}</body>`)

  fs.writeFileSync(path.join('public', 'index.html'), html)
}

function bundleScripts() {
  var b = browserify()

  b.add('./app.js')

  b.transform('brfs')
  b.transform(nanohtml)
  b.plugin('tinyify')

  b.bundle().pipe(fs.createWriteStream('public/assets/index.js'))
}

function copyAssets() {
  var assetsPath = path.join(__dirname, 'assets')
  if (fs.existsSync(assetsPath)) {
    ncp(assetsPath, 'public/assets', function (err) {
      if (err) throw err
    })
  }

  ncp(path.join(__dirname, 'index.css'), 'public/assets/index.css', function (err) {
    if (err) throw err
  })
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public')
}

if (!fs.existsSync('public/assets')) {
    fs.mkdirSync('public/assets')
}

bundleScripts()
copyAssets()
bundleHTML()

