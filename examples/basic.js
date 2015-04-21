

let anim = [
  {
    transitionDuration: '1s',
    transitionTimingFunction: 'ease-in',
    transform: {
      translate3d: [-20, -20, -50],
      scale: [2]
    },
    opacity: 0.5,
    callback: () => {
      console.log('callback');
    }
  },
  {
    transitionDuration: '2s',
    transitionTimingFunction: 'ease-out',
    transform: {
      translate3d: [40, 40, 50],
      scale: [0.8]
    },
    opacity: 1
  },
  {
    transitionDuration: '1s',
    transitionTimingFunction: 'linear',
    opacity: 0
  },
  {
    transitionDuration: '3s',
    transitionTimingFunction: 'ease-in-out',
    transform: {
      translate3d: [0, 0, 0],
      scale: [1]
    },
    opacity: 1
  }
];

let el = document.querySelector('div');

let animation = new Animate(el, anim);

animation.start();
