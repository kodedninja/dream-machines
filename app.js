var html = require('choo/html')
var choo = require('choo')
var fs = require('fs')
var path = require('path')
var format = require('./lib/format')

var content = fs.readFileSync(path.join(__dirname, 'text.md'), 'utf8')

var app = choo()

app.route('/', view)

function view (store, emit) {
  return html`
    <body>
      <div class="p-a o-0_8 w-100" style="z-index:-1">
        <img class="p-a" style="width:40%; top:-200px" src="/assets/images/bg1.png" alt="">
        <img class="p-a" style="width:50%; top: 320px; left:20%" src="/assets/images/bg2.png" alt="">
        <img class="p-a" style="width:50%; top:-50px; right:-50px" src="/assets/images/bg3.png" alt="">
        <img class="p-a" style="width:30%; top:800px; left: 10%" src="/assets/images/ghost.png" alt="">
      </div>
      <header>
        <h1 class="ta-c">Inside Dream Machines</h1>
      </header>
      <main>
        ${format(content)}
      </main>
    </body>
  `
}

module.exports = app.mount('body')
