import Animate from './css-animation-chainer';

document.addEventListener('DOMContentLoaded', () => {
  let anim = [
    {
      transitionDuration: '1s',
      transitionTimingFunction: 'ease-in',
      transform: {
        translate3d: [0, 0, 200],
        scale: [1]
      },
      zIndex: '2'
    },
    {
      transform: {
        translate3d: [300, 0, 200],
        scale: [1]
      },
      opacity: 0.8
    },
    {
      transform: {
        translate3d: [300, 0, 0],
        scale: [1]
      },
      opacity: 1
    },
    {
      transform: {
        translate3d: [300, 0, -200],
        scale: [1]
      },
      zIndex: '-1'
    },
    {
      transform: {
        translate3d: [0, 0, -200],
        scale: [1]
      }
    },
    {
      transform: {
        translate3d: [0, 0, 0],
        scale: [1]
      },
      zIndex: '1'
    }
  ];

  let block = document.querySelector('.block');

  window.animation = new Animate(block, anim);

  animation.start();
})