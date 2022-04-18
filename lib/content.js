var html = require('choo/html')
var Component = require('choo/component')
var format = require('./format')

module.exports = class Content extends Component {
  constructor () {
    super()
    this.text = ''
  }

  createElement (text) {
    this.text = text

    // disable rehydration
    if (typeof window !== 'undefined') {
      var el = document.getElementById('content')
      if (el) return el
    }

    return html`
      <main id="content">
        <img class="w-70 mx-a d-b h-120px of-c mt-1 mb-5" src="/assets/images/landscape.gif" alt="" />
        ${format(text)}
      </main>
    `
  }

  load(el) {
    // disable re-rendering
    el.isSameNode = function (target) {
      return true
    }
  }

  update(text) {
    return this.text !== text
  }
}
