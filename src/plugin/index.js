import * as components from './components'

// const VuePlugin = {}

// VuePlugin.install = function (Vue, options) {
//   console.log(components)
//   for (let component in components) {
//     Vue.component('ml' + component, components[component])
//   }
// }

// export default VuePlugin

export default {
  install (Vue, options) {
    // console.log(components)
    for (let component in components) {
      Vue.component('ml' + component, components[component])
    }
  }
}
