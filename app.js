var html = require('choo/html')
var choo = require('choo')
var fs = require('fs')
var path = require('path')
var format = require('./lib/format')

var content = fs.readFileSync(path.join(__dirname, 'text.md'), 'utf8')
var TITLE = 'Inside Dream Machines'
var DESCRIPTION = 'Phenomenology for digital ghosts'
var URL = 'https://hex22.org/inside-dream-machines/'

var app = choo()

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

app.use(require('choo-meta')())
app.use(function (state, emitter) {
  state.headerOpen = false;

  emitter.on('header:toggle', function () {
    state.headerOpen = !state.headerOpen
    emitter.emit(state.events.RENDER)
  })
})
app.use(function (state, emitter) {
  emitter.on(state.events.DOMCONTENTLOADED, function () {
    if (typeof window !== undefined) {
      var grainEl = document.getElementById('grain')

      setInterval(function () {
        var x = random(-5, 5)
        var y = random(-5, 5)
        grainEl.style.transform = `translate(${x}%, ${y}%)`
      }, 100)
    }
  })
})

app.route('/', view)

module.exports = app.mount('body')

function view (state, emit) {
  emit('meta', {
    'title': TITLE,
    'description': `${TITLE}. ${DESCRIPTION}. By Hunor Karamán`,
    'keywords': 'Dream machines, digital, new worlds, simulosis, cyborg, phenomenology',
    'og:title': TITLE,
    'og:site_name': 'hex22.org',
    'og:url': URL,
    'og:description': DESCRIPTION,
    'og:type': 'website',
    'og:locale': 'en_US',
    'twitter:card': 'summary',
    'twitter:title': TITLE,
    'twitter:description': DESCRIPTION,
    'twitter:url': URL
  })

  function _onClick() {
    emit('header:toggle')
  }
  
  return html`
    <body>
      <header>
        <div id="grain" class="grain"></div>
        <h1>Inside <br/>Dream <br/>Machines</h1>
        <button onclick="${_onClick}" class="clear-button f-r" title="${state.headerOpen ? 'Close information section' : 'Open information section'}">?</button>
        ${state.headerOpen ? html`
          <div class="mt-2_5">
            <p>Phenomenology for digital ghosts.</p>
            <div class="mt-5 mb-5">
              <p>ABOUT</p>
              <p><a href="https://hex22.org">Hunor Karamán</a> is an optimistic computational nihilist on a journey of poetry, metaphysics, ecological thought, and the politics of AI and automation. He currently studies how machines learn from data at the Johannes Kepler University in Linz.</p>
              <p>Photos by <a href="https://www.instagram.com/lethertouch">Kata</a> and by <a href="https://www.are.na/hunor-karaman/the-eye-obptktxn2ni">me</a>.</p>
              <p>2022 04 14</p>
            </div>
          </div>
        ` : null}
      </header>
      <main>
        ${format(content)}
      </main>
    </body>
  `
}

