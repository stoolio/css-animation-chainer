/* eslint comma-spacing: 0 */

function transform1(name, x = 0, unit = '') {
  return `${name}(${x}${unit})`;
}

function transform2(name, x = 0, y = 0, unit = '') {
  return `${name}(${x}${unit}, ${y}${unit})`;
}

function transform3(name, x = 0, y = 0, z = 0, unit = '') {
  return `${name}(${x}${unit}, ${y}${unit}, ${z}${unit})`;
}

function translateX(x) {
  return transform1('translateX', x, 'px');
}

function translateY(y) {
  return transform1('translateY', y, 'px');
}

function translateZ(z) {
  return transform1('translateZ', z, 'px');
}

function translate(x, y) {
  return transform2('translate', x, y, 'px');
}

function translate3d(x, y, z) {
  return transform3('translate3d', x, y, z, 'px');
}

function scaleX(x) {
  return transform1('scaleX', x);
}

function scaleY(y) {
  return transform1('scaleY', y);
}

function scale(x, y) {
  if(typeof y === 'undefined') {
    return transform1('scale', x);
  } else {
    return transform2('scale', x, y);
  }
}

function scale3d(x, y, z) {
  return transform3('scale3d', x, y, z);
}

function rotateX(x) {
  return transform1('rotateX', x, 'deg');
}

function rotateY(y) {
  return transform1('rotateY', y, 'deg');
}

function rotateZ(z) {
  return transform1('rotateZ', z, 'deg');
}

function rotate(x, y) {
  return transform2('rotate', x, y, 'deg');
}

function rotate3d(x, y, z, a) {
  return `rotate3d(${x}, ${y}, ${z}, ${a}deg)`;
}

function skewX(x) {
  return transform1('skewX', x, 'deg');
}

function skewY(y) {
  return transform1('skewY', y, 'deg');
}

function skew(x, y) {
  return [
    transform1('skewX', x, 'deg'),
    transform1('skewY', y, 'deg')
  ];
}

export default {
  translateX,
  translateY,
  translateZ,
  translate,
  translate3d,
  scaleX,
  scaleY,
  scale,
  scale3d,
  rotateX,
  rotateY,
  rotateZ,
  rotate,
  rotate3d,
  skewX,
  skewY,
  skew
};
