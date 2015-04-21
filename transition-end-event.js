var events = {
  Webkit: 'webkit',
  Moz: 'moz',
  O: 'o',
  ms: 'MS'
};

module.exports = (function transitionEndEvent(el, event) {
  if(el.style.transition !== undefined) {
    return 'transitionend';
  }
  for(event in events) {
    if(el.style[event + 'Transition'] !== undefined) {
      return events[event] + 'TransitionEnd';
    }
  }
  return null;
}(document.createElement('div')));
