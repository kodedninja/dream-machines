var fs = require('fs')
var path = require('path')
var app = require('./app')
var ncp = require('ncp').ncp

var html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8')
html = html.replace('%%BODY%%', app.toString('/'))

if (!fs.existsSync('public')) {
  fs.mkdirSync('public')
}

if (!fs.existsSync('public/assets')) {
    fs.mkdirSync('public/assets')
}

fs.writeFileSync(path.join('public', 'index.html'), html)

ncp(path.join(__dirname, 'assets'), 'public/assets', function (err) {
  if (err) throw err
})

ncp(path.join(__dirname, 'index.css'), 'public/index.css', function (err) {
  if (err) throw err
})
