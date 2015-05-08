# This is a work in progress!!

Currently, the files in master should work!

I ripped it out of a project, and I need to do a bit of cleaning up.

I've tried my best to document the various quirks, but no guarantees are given.

I would be delighted to hear how you've managed to break it though!

Also, if I've made any horrible errors below, please let me know.

Currently it requires instantiating an object, but I feel like the future is functional (see the functional-refactor branch).

## Usage

Animations are defined as the arrays of objects (this is not a good animation):

```
var animation = [
  {
    transitionDuration: '1s',
    transitionTimingFunction: 'ease-in',
    transform: {
      translate3d: [-20, -20, -50],
      scale: [2]
    },
    opacity: 0.5
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
    transitionDuration: '3s',
    transitionTimingFunction: 'ease-in-out',
    transform: {
      translate3d: [0, 0, 0],
      scale: [1]
    },
    opacity: 1
  }
];
```

Do not include `transitionProperties`, those are calculated automatically for you.

The properties will be added to your element, and it will clean up after itself and leave your inline styles pristine.

```
var el = document.querySelector('.my-el');

var animation = new Animate(el, animation);
```

Now, for the fun part!

```
animation.start(); // Play!
animation.trats(); // Reverse!
animation.bounce(); // Play, then Reverse!
```

The `trats` method, you might notice, is `start` backwards. I had a `reverse` property, so I got creative.

## Info

The following transform properties are supported (that should be all of them). They are not currently prefixed:

* `translateX`
* `translateY`
* `translateZ`
* `translate`
* `translate3d`
* `scaleX`
* `scaleY`
* `scale`
* `scale3d`
* `rotateX`
* `rotateY`
* `rotateZ`
* `rotate`
* `rotate3d`
* `skewX`
* `skewY`
* `skew`

`transform` properties don't require units (and will always use `px` or `deg`). There arguments should be passed in as an array, for instance:

`translate: [15, 15]`

You can also pass in any CSS properties you wish, like opacity above. They will automatically be added to the `transitionProperties`, but it isn't currently smart about it. It just uses the exact keys you pass in so you may need to use a longhand or shorthand property ([Here is a great MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)).

Non-transform values should be passed in as a string if they are not unitless numbers.

Of course, you can also pass in any of the transition properties, but you must pass them in separately:

`transition: 'all 1s ease-in' // NO`
`transitionDuration: '1s' // Yes`

There are some options:

`start(delay, repeating, cb) // or trats , bounce`

* `delay` (ms) : How long to wait to start the animation
* `repeating` (bool) : Go on forever. There is currently no way to stop...
* `cb` (function) : A function to call when the animation is over, currently doesn't work with `bounce()`

There are a few more things to note:

All properties carry over. For instance, if you specify `transitionDuration` once and you don't want to change it, any steps following will use that value, like so:

```
var animation = [
  {
    transitionDuration: '1s',
    scale3d: [1, 2, 3]
  },
  {
    // a transitionDuration value of '1s' is used
    scale3d: [3, 2, 1]
  },
  // and so on
];
```

There can be some wierdness when playing an animation backwards because of this. Things might not work the way you expect, so you might need to be more explicit depending on the effect your going for.

## How

`transitionEnd` events are used and required for this to work. They will be properly prefixed to the best of my knowledge.

An emergency timeout is started with the animation. If the animation hasn't finished after it's supposed to, it will fire and clean up. The total animation time is calculated via the `transitionDuration` times.

All styles are added inline in a `requestAnimationFrame` , and it is set up to wait for all animations to finish before starting the next step. As an example, if you animate `opacity` and `transform`, two transitionEnd events will fire. This means you should be able to set different `transitionDuration` values for each property. However, it won't fire the next animation until the longest is finished, and that might not be what you want. I would like to improve this so it could potentially work in a more interesting way:

Animate `opacity` from `0` to `1` over `4s` while `transform: scale` from `0` to `1` for `2s` and then `translate` somewhere for `2s`

and have them run concurrently so they finish at *roughly* the same time.

### Happy Animating!


