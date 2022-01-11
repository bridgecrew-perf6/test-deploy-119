import debounce from './debounce'

const install = function(Vue) {
  Vue.directive('debounce', debounce)
}

debounce.install = install
export default debounce
