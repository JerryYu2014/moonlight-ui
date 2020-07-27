import * as components from './components'

const VuePlugin = {}

VuePlugin.install = function (Vue, options) {
  for (let component in components) {
    Vue.component('ml' + component, components[component])
  }
}

export default VuePlugin
