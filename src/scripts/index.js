// ES6 Polyfills
import 'core-js/modules/es6.array.for-each'
import 'core-js/modules/es6.array.map'
import 'core-js/modules/es6.object.keys'
import 'core-js/modules/es6.promise'

// Essentials
import Emitter from 'tiny-emitter/instance'
import WhenDomReady from 'when-dom-ready'
import LoadJS from 'loadjs'
import IsMobile from 'ismobilejs'
import { throttle as FrameThrottle } from 'frame-throttle'
import { detect as DetectBrowser } from 'detect-browser'

const Kernel = class {
  static setup (payload) {
    if (typeof payload !== 'object') {
      throw new Error('Panic: No payload found.')
    }

    Kernel.debug = payload.kernel.debug
    Kernel.config = payload.kernel.config
    Kernel.browser = DetectBrowser()
    Kernel.isMobile = IsMobile.any
    Kernel.mobileDevice = IsMobile
    Kernel.cachedRemValue = Kernel.getRemValue()
    Kernel.domReady = false
    Kernel.log('Setup', 'kernel')
  }

  static boot () {
    Kernel.log('##############################', 'kernel')
    Kernel.log('########## Boot start', 'kernel')

    // Modules
    Kernel.loadModules()

    // Events
    Kernel.coreEvents()
    Kernel.emitEvent('kernel.boot')
    Kernel.subscribeOnce('dom.ready', () => { Kernel.domReady = true })
    WhenDomReady().then(() => Kernel.emitEvent('dom.ready'))

    // App
    Kernel.run()

    Kernel.log('########## Boot end', 'kernel')
    Kernel.log('##############################', 'kernel')
  }

  // Module management
  static addModule (Module) {
    Kernel.log(`Add module '${Module.name}'`, 'kernel')
    Kernel.modules.push(new Module())
  }

  static loadModules () {
    Kernel.modules.forEach(module => {
      Kernel.log(`Load module '${module.constructor.name}'`, 'kernel')
      module.run()
    })
  }

  // Load Apps dependencies
  static run () {
    if (typeof Kernel.config.run === 'object') {
      Kernel.config.run.forEach(item => {
        Kernel.log(`Loading ${item.deps.length} dependencies for '${item.name}'`, 'kernel')

        LoadJS(item.deps, item.name)
        LoadJS.ready(item.name, {
          success: () => {
            Kernel.log(`Loaded dependencies for ${item.name}`, 'kernel')
          },

          error: (err) => {
            throw new Error(`Failed to load dependencies for ${item.name} (${err}`)
          }
        })
      })
    } else {
      throw new Error('Nothing to run.')
    }
  }

  // Event management
  static subscribeTo (eventName, callback, context = null) {
    Kernel.log(`Subscribe to '${eventName}'`, 'kernel')
    Emitter.on(eventName, callback, context)
  }

  static subscribeOnce (eventName, callback, context = null) {
    Kernel.log(`Subscribe once to '${eventName}'`, 'kernel')
    Emitter.once(eventName, callback, context)
  }

  static unsubscribeTo (eventName, callback) {
    Kernel.log(`Unsubscribe To '${eventName}'`, 'kernel')
    Emitter.off(eventName, callback)
  }

  static emitEvent (eventName, event = {}) {
    Kernel.log(`Emit '${eventName}'`, 'kernel')
    Emitter.emit(eventName, event)
  }

  static coreEvents () {
    // Window resize event
    const resizeEvent = FrameThrottle((e) => Kernel.emitEvent('window.resize', e))
    window.addEventListener('resize', resizeEvent)

    // rem change event
    const remChangeEvent = (e) => {
      const currentRemValue = Kernel.getRemValue()

      if (Kernel.cachedRemValue !== currentRemValue) {
        Kernel.emitEvent('kernel.remchange', { old: Kernel.cachedRemValue, new: currentRemValue })
        Kernel.cachedRemValue = currentRemValue
      }
    }

    Kernel.subscribeTo('window.resize', remChangeEvent)
  }

  // Dom readiness
  static isDomReady () {
    return Kernel.domReady
  }

  // Logging and debug
  static log (message, from = null) {
    if (Kernel.debug) {
      console.log((from ? `[${from.toUpperCase()}] ` : '') + message)
    }
  }

  // Utils
  static getRemValue () {
    return parseFloat(getComputedStyle(document.documentElement).fontSize)
  }
}

// Kernel setup
Kernel.debug = null
Kernel.config = []
Kernel.modules = []

// Kernel init
Kernel.setup({
  kernel: {
    debug: true,
    config: {}
  }
})

Kernel.boot()

window.Kernel = Kernel
