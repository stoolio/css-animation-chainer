import Animate from './CSSAnimator-no-transitionend';

document.addEventListener('DOMContentLoaded', () => {
  let anim = [
    {
      transitionDuration: '1s',
      transitionTimingFunction: 'ease-in',
      transform: {
        translate: [200, 0],
        scale: [1.5]
      },
      opacity: 0.5
    },
    {
      transform: {
        translate: [200, 200],
        scale: [2]
      },
      opacity: 0.8
    },
    {
      transform: {
        translate: [0, 200],
        scale: [1.5]
      },
      opacity: 1
    },
    {
      transform: {
        translate: [0, 0],
        scale: [1]
      }
    }
  ];

  let block = document.querySelector('.block');

  window.animation = new Animate(block, anim);

  animation.start();
})