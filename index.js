var fs = require('fs')
var path = require('path')
var ncp = require('ncp').ncp
var dedent = require('dedent')
var browserify = require('browserify')
var nanohtml = require('nanohtml')
var concat = require('concat-stream')
var crypto = require('crypto')

var app = require('./app')

var TEMPLATE = dedent`
<!DOCTYPE HTML>
<html lang="en">
	<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    %%HEAD%%
  </head>
  %%BODY%%
</html>
`

function bundleHTML(bundleState) {
  var state = {}
  var body = app.toString('/', state)

  var head = dedent`
    <title>${state.title}</title>
    ${Object.keys(state.meta).map(function (key) {
      var attribute = key.substr(0, 3) === 'og:' ? 'property' : 'name'
      return '<meta ' + attribute + '="' + key + '" content="' + state.meta[key] + '" >'
    }).join('\n')}
 
    <link rel="preload" href="${bundleState.stylePath}" as="style">
    <link href="${bundleState.stylePath}" rel="stylesheet">

    <script>window.initialState = ${JSON.stringify(state)}</script>
  `
  var script = `<script src="${bundleState.scriptPath}" defer></script>`
  
  var html = TEMPLATE.replace('%%BODY%%', body).replace('%%HEAD%%', head)
  html = html.replace('</body>', `${script}</body>`)

  fs.writeFileSync(path.join('public', 'index.html'), html)
}

function bundleScripts() {
  return new Promise(function (resolve) {
    var sha512 = crypto.createHash('sha512')
    
    var b = browserify()

    b.add('./app.js')

    b.transform('brfs')
    b.transform(nanohtml)
    b.plugin('tinyify')

    var bundleStream = b.bundle()
    bundleStream.on('data', function (chunk) {
      sha512.update(chunk)
    })

    bundleStream.pipe(concat({ type: 'buffer' }, function (bundle) {
      var hash = sha512.digest('buffer').toString('hex').slice(0, 16)
      var scriptPath = `assets/index.${hash}.js`
      
      var ws = fs.createWriteStream(path.join(`public`, scriptPath))
      ws.write(bundle)
      ws.end()

      resolve(scriptPath)
    }))
  })
}

function bundleStyles () {
  return new Promise(function (resolve) {
    var sha512 = crypto.createHash('sha512')

    var rs = fs.createReadStream(path.join(__dirname, 'index.css'))
    rs.on('data', function (chunk) {
      sha512.update(chunk)
    })

    rs.pipe(concat({ type: 'buffer' }, function (bundle) {
      var hash = sha512.digest('buffer').toString('hex').slice(0, 16)
      var stylePath = `assets/index.${hash}.css`

      var ws = fs.createWriteStream(path.join(`public`, stylePath))
      ws.write(bundle)
      ws.end()

      resolve(stylePath)
    }))
  })
}

function copyAssets (state) {
  return new Promise(function (resolve, reject) {
    var assetsPath = path.join(__dirname, 'assets')
    if (fs.existsSync(assetsPath)) {
      ncp(assetsPath, 'public/assets', function (err) {
        if (err) {
          reject(err)
          return
        }

        resolve()
      })
    }
  })
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public')
}

if (!fs.existsSync('public/assets')) {
    fs.mkdirSync('public/assets')
}

Promise.all([
  bundleScripts(),
  bundleStyles(),
  copyAssets()
]).then(function (paths) {
  console.log(paths[0])
  console.log(paths[1])
  bundleHTML({
    scriptPath: paths[0],
    stylePath: paths[1]
  })
})

