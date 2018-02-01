export class Polyfills {
  run () {
    this.transitionEnd()
    this.objectForEach()
  }

  transitionEnd () {
    const transitionEndEventName = () => {
      const el = document.createElement('div')
      const transitions = {
        transition: 'transitionend',
        OTransition: 'otransitionend', // oTransitionEnd in very old Opera
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd'
      }

      for (let i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
          return transitions[i]
        }
      }
    }

    window.transitionEnd = transitionEndEventName()
  }

  objectForEach () {
    // IE 11
    if (typeof NodeList.prototype.forEach !== 'function') {
      NodeList.prototype.forEach = Array.prototype.forEach
    }
  }
}
