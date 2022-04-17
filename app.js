var html = require('choo/html')
var choo = require('choo')
var fs = require('fs')
var path = require('path')

var Content = require('./lib/content')
var stores = require('./lib/stores')

var content = fs.readFileSync(path.join(__dirname, 'text.md'), 'utf8')
var TITLE = 'Inside Dream Machines'
var DESCRIPTION = 'A phenomenological index of digital specters'
var URL = 'https://hex22.org/inside-dream-machines/'

var app = choo()

app.use(require('choo-meta')())
app.use(stores.header)
app.use(stores.animateGrain)
app.use(stores.concepts)

app.route('/', view)

module.exports = app.mount('body')

function view (state, emit) {
  emit('meta', {
    'title': TITLE,
    'description': `${TITLE}. ${DESCRIPTION}. By Hunor Karamán`,
    'keywords': 'Dream machines, digital, new worlds, simulosis, cyborg, phenomenology, anxiety, depression',
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

  function _onClick () {
    emit('header:toggle')
  }

  function _highlight (i) {
    emit('concepts:highlight', i)
  }
  
  return html`
    <body>
      <header id='header'>
        <div id="grain" class="grain"></div>
        <h1>Inside <br/>Dream <br/>Machines</h1>
        ${!state.headerOpen ? html`<span class="f-l f0_75 tt-u">${state.concepts[state.selectedConcept]}</span>` : null}
        <button onclick="${_onClick}" class="clear-button f1 f-r" title="${state.headerOpen ? 'Close information section' : 'Open information section'}">?</button>
        ${state.headerOpen ? html`
          <div class="mt-2_5">
            <p>${DESCRIPTION}.</p>
            <div>
              ${state.concepts.map(function (name, i) {
                return html`
                  <button
                    class="clear-button mt-0_5 mr-0_5 tt-u d-ib ws-nw f0_75 ${i === state.selectedConcept ? 'highlight' : 'tc-white'}"
                    onclick=${_highlight.bind(null, i)}
                  >
                    ${name}
                  </button>
                `
              })}
            </div>
            <div class="mt-5 mb-3">
              <p>ABOUT</p>
              <p><a href="https://hex22.org">Hunor Karamán</a> is an optimistic computational nihilist on a journey of poetry, metaphysics, ecological thought, and the politics of AI and automation. He currently studies how machines learn from data at the Johannes Kepler University in Linz.</p>
              <p>2022 04 14</p>
            </div>
          </div>
        ` : null}
      </header>
      ${state.cache(Content, 'content').render(content)}
    </body>
  `
}

