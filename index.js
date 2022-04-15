var fs = require('fs')
var path = require('path')
var app = require('./app')
var ncp = require('ncp').ncp
var dedent = require('dedent')

var TEMPLATE = dedent`
<!DOCTYPE HTML>
<html lang="en">
	<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="/index.css" rel="stylesheet">

    %%HEAD%%
  </head>
  %%BODY%%
</html>
`

var state = {}
var body = app.toString('/', state)

var head = dedent`
  <title>${state.title}</title>
  ${Object.keys(state.meta).map(function (key) {
    var attribute = key.substr(0, 3) === 'og:' ? 'property' : 'name'
    return '<meta ' + attribute + '="' + key + '" content="' + state.meta[key] + '" >'
  }).join('\n')}
`
var html = TEMPLATE.replace('%%BODY%%', body).replace('%%HEAD%%', head)

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
