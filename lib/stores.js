
module.exports = { header, animateGrain, concepts }

function header (state, emitter) {
  state.headerOpen = false;

  emitter.on('header:toggle', function () {
    state.headerOpen = !state.headerOpen
    emitter.emit(state.events.RENDER)
  })
}

function animateGrain (state, emitter) {
  emitter.on(state.events.DOMCONTENTLOADED, function () {
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
  })
}

function concepts (state, emitter) {
  state.concepts = ['ghost', 'dream machine', 'dream', 'simulosis', 'user', 'body']
  state.selectedConcept = -1
  state.currentElements = []

  emitter.on(state.events.DOMCONTENTLOADED, function () {
    emitter.on('concepts:highlight', function (index) {
      state.selectedConcept = index !== state.selectedConcept ? index : -1

      state.currentElements.forEach(function (el) {
        el.classList.remove('highlight')
      })

      if (state.selectedConcept !== -1) {
        var els = document.querySelectorAll(`span[data-c="${state.concepts[index]}"]`)

        els.forEach(function (el) {
          el.classList.add('highlight')
        })
        state.currentElements = els
      } else {
        state.currentElements = []
      }

      emitter.emit(state.events.RENDER)
    })
  })
}

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

