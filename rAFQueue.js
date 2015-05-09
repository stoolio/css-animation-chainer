let rAFCb = [];
let animationQueued = false;
let token = false;

function noop() {}

let rAF = (function(w) {
  return  w.requestAnimationFrame ||
          w.webkitRequestAnimationFrame ||
          w.mozRequestAnimationFrame ||
          function (cb) {
            setTimeout(cb, 1000/60);
          }
}(window));

function performAnimations() {
  animationQueued = false;
  let length = rAFCb.length;
  let i = -1;
  while(++i < length) {
    rAFCb[i].call();
  }
  rAFCb.length = 0;
  token = false;
}

export default function queueAnimation(fn) {
  if(!animationQueued) {
    animationQueued = rAF(performAnimations);
    token = Date.now();
  }
  let id = rAFCb.push(fn);
  return {
    token,
    id
  };
}

export function dequeueAnimation(fn) {
  if(token && token === fn.token) {
    rAFCb[fn.id] = noop;
    return true;
  }
  return false;
}
