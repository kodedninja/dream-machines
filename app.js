var html = require('choo/html')
var choo = require('choo')
var fs = require('fs')
var path = require('path')
var format = require('./lib/format')
var onIntersect = require('on-intersect')

var content = fs.readFileSync(path.join(__dirname, 'text.md'), 'utf8')
var TITLE = 'Inside Dream Machines'
var DESCRIPTION = 'Phenomenology for digital ghosts'
var URL = 'https://hex22.org/inside-dream-machines/'

var app = choo()

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
    if (typeof window !== 'undefined') {
      var grainEl = document.getElementById('grain')

      function tick () {
        setTimeout(function () {
          var x = random(-5, 5)
          var y = random(-5, 5)
          grainEl.style.transform = `translate(${x}%, ${y}%)`
          window.requestAnimationFrame(tick)
        }, 100) // 10 fps
      }

      window.requestAnimationFrame(tick)
    }
  })
})
app.use(function (state, emitter) {
  var sections = ['INTRO', 'THE GHOST', 'DREAM MACHINES', 'THE DREAM', 'SIMULOSIS']
  
  state.section = 'INTRO'

  emitter.on(state.events.DOMCONTENTLOADED, function () {
    if (typeof window !== 'undefined') {
      var header = document.getElementById('header')
      var bottom = header.getBoundingClientRect().bottom
      var headings = document.querySelectorAll('h2')

      document.addEventListener('scroll', function () {
        headings.forEach(function (el, i) {
          var top = el.getBoundingClientRect().top
          if (top > 0 && top <= bottom) {
            var title = sections[i + 1]

            if (state.section !== title) {
              state.section = title
              emitter.emit(state.events.RENDER)
            }
          }
        })
      })
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
      <header id='header'>
        <div id="grain" class="grain"></div>
        <h1>Inside <br/>Dream <br/>Machines</h1>
        ${!state.headerOpen ? html`<span class="f-l" style="font-size:0.75rem">${state.section}</span>` : null}
        <button onclick="${_onClick}" class="clear-button f-r" title="${state.headerOpen ? 'Close information section' : 'Open information section'}">?</button>
        ${state.headerOpen ? html`
          <div class="mt-2_5">
            <p>Phenomenology for digital ghosts.</p>
            <div class="mt-5 mb-5">
              <p>ABOUT</p>
              <p><a href="https://hex22.org">Hunor Karamán</a> is an optimistic computational nihilist on a journey of poetry, metaphysics, ecological thought, and the politics of AI and automation. He currently studies how machines learn from data at the Johannes Kepler University in Linz.</p>
              <p>Photos by <a href="https://www.instagram.com/lethertouch">Kata Bokor</a> and <a href="https://www.are.na/hunor-karaman/the-eye-obptktxn2ni">me</a>.</p>
              <p>2022 04 14</p>
            </div>
          </div>
        ` : null}
      </header>
      <main>
        <img class="w-100 h-120px of-c mt-0_5 mb-5" src="/assets/images/waves.jpg" alt="" loading="lazy" />
        ${format(content)}
      </main>
    </body>
  `
}

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

