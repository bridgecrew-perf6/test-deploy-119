export default {
  inserted(el, binding) {
    const [fn, event = 'click', time = 300] = binding.value
    let timer
    el.addEventListener(event, () => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => fn(), time)
    })
  }
}
