import endEvent from './transition-end-event';
import queueAnimation from './rAFQueue';
import t from './transformHelpers';

function makeAnim(anim) {
  let data = [], i;
  for(i in anim) {
    data.push(t[i].apply(null, anim[i]));
  }
  return data.join(' ');
}

var propsAnimated = [];

function waitForAllEvents() {
  console.log(propsAnimated);
  propsAnimated.pop();
  if(propsAnimated.length === 0) {
    console.log('let\'s do this');
    if(typeof this.callbacks[this.index] === 'function') {
      this.callbacks[this.index].call(this);
    }
    this.doAnimation();
  }
}

//Special animation function
let doAnimation = function() {

  let isLast = !this.reverse ? (this.index >= (this.lastIndex - 1)) : (this.index < 0);

  let anim = this._getAnim();

  for(var prop in anim) {
    if(prop.includes('transition')) {
      continue;
    }
    propsAnimated.push(prop);
  }

  // I hate this, but transform will emit a change on any slight change
  // but opacity won't
  if(!isLast && anim.opacity === this.styles.opacity ||
     (anim.opacity === 1 && this.styles.opacity === '')) {
    propsAnimated.splice(propsAnimated.indexOf('opacity'), 1);
  }

  queueAnimation(function() {
    console.log('animating: ', propsAnimated.join(', '));
    this.styles.transitionProperty = propsAnimated.join(', ');
    for(var i in anim) {
      this.styles[i] = anim[i];
    }
    this.index = this.index + (!this.reverse ? 1 : -1);
  }.bind(this));

  if(isLast) {
    this._remove(this.waitForAllEvents);
    this._add(this.onEnd);
  }
};

let removeStyles = function() {
  this.els.forEach(function(el, i) {
    this.allChanged[i].forEach(prop => {
      this.styles[i].removeProperty(prop);
    })
  })
}

let startAnimation = function() {
  this.index = (!this.reverse ? 0 : this.lastIndex - 1);
  let emergencyThreshold = this.totalDuration + this.delay + 500 + (this.reverse ? parseInt(this.anims[0].transitionDuration) * 1000 : 0);
  setTimeout(function() {
    this._add(this.waitForAllEvents);
    this.doAnimation();
  }.bind(this), this.delay);
  this.emergencyTimer = setTimeout(function() {
    console.log('emergency!!');
    this.onEnd();
  }.bind(this), emergencyThreshold);
};

let onEnd = function() {
  console.log('done!');
  clearTimeout(this.emergencyTimer);
  // Just in case there's an issue and the setTimeout calls this function
  this._remove(this.waitForAllEvents);
  this._remove(this.onEnd);
  propsAnimated.length = 0;

  if(this.repeating) {
    this.initialFn.call(this);
  }

  // otherwise, cleanup our inline styles if necessary
  if(this.shouldReset) {
    this.allChanged.forEach(prop => {
      this.styles.removeProperty(prop);
    });
  }

  // we are no longer animating, let it happen again
  this.animating = false;

  // callback? used for bounce aka start->trats
  // and/or sequenced animations
  if(typeof this.cb === 'function') {
    let fn = this.cb;
    this.cb = undefined;
    fn.call(this);
  }
};

function Animate(el, opts) {
  this.el = el;

  // Sane defaults
  this.reverse = false;
  this.animating = false;
  this.index = 0;
  this.shouldReset = true;

  // This is messed up, I should put them on the prototype
  // but they shouldn't be part of the API, so I might
  // _name them...
  this.startAnimation = startAnimation.bind(this);
  this.onEnd = onEnd.bind(this);
  this.doAnimation = doAnimation.bind(this);
  this.waitForAllEvents = waitForAllEvents.bind(this);

  if(Array.isArray(el)) {
    // insert code to handle an array of items to animate
    return;
  } else if(typeof el !== 'undefined') {
    this.styles = el.style;
  } else {
    return;
  }

  this.originalStyles = this._getStyles();
  // Not using this currently, but I had an idea
  // to use it. This is here if I remember...
  // this.currentStyles = this._getStyles();
  this.allChanged = [];
  this.callbacks = [];
  this.totalDuration = 0;

  let lastAnimProps = {
    transitionDuration: this.originalStyles.transitionDuration,
    transitionTimingFunction: this.originalStyles.transitionTimingFunction
  };

  this.anims = opts.map(function(anim, index) {
    var processedAnim;
    if(anim.transform && typeof anim.transform !== 'string') {
      anim.transform = makeAnim(anim.transform);
    }
    // This monstrosity supports carrying over stats
    // For instance, enter one transitionDuration, and
    // it will be used for all steps
    processedAnim = {
      transitionDuration: anim.transitionDuration || lastAnimProps.transitionDuration,
      transitionTimingFunction: anim.transitionTimingFunction || lastAnimProps.transitionTimingFunction
    };
    if(anim.opacity !== undefined) {
      processedAnim.opacity = anim.opacity;
    }
    if(anim.transform !== undefined) {
      processedAnim.transform = anim.transform;
    }
    lastAnimProps.transitionDuration = processedAnim.transitionDuration;
    lastAnimProps.transitionTimingFunction = processedAnim.transitionTimingFunction;
    this.totalDuration += parseInt(processedAnim.transitionDuration) * 1000;
    for(var i in processedAnim) {
      if(i === 'callback') {
        this.callbacks[index] = processedAnim[i];
        delete processedAnim[i];
        continue;
      }
      if(i.includes('transition')) {
        i = 'transition';
      }
      if(this.allChanged.indexOf(i) === -1) {
        this.allChanged.push(i);
      }
    }
    return processedAnim;
  }.bind(this));

  console.log('duration: ', this.totalDuration);
  this.lastIndex = this.anims.length;
}

Animate.prototype = {
  start: function(delay, repeating, cb) {
    if(this.animating) {
      return;
    }

    this.reverse = false;
    this.initialFn = this.initialFn || this.trats;

    this._begin(delay, repeating);
  },
  // originally it was called reverse, but it didn't work.
  // Then I saw it. This is still not a good name.
  trats: function(delay, repeating, cb) {
    if(this.animating){
      return;
    }

    this.reverse = true;
    this.initialFn = this.initialFn || this.trats;

    this._begin(delay, repeating);
  },
  bounce: function(delay, repeating, cb) {
    if(this.animating){
      return;
    }

    this.cb = this.trats;
    this.initialFn = this.trats;

    this.start(delay, repeating);
  },
  stop: function() {
    // Figure out how to gracefully stop and enter code here
  },
  pause: function() {
    // See above, but really, this should be exactly the same
  },
  reset: function(reset = true) {
    this.shouldReset = reset;
  },
  _isLast: function() {
    return !this.reverse ? (this.index >= (this.lastIndex - 1)) : (this.index < 0);
  },
  _add: function(cb) {
    this.el.addEventListener(endEvent, cb);
  },
  _remove: function(cb) {
    this.el.removeEventListener(endEvent, cb);
  },
  _begin: function(delay, repeating) {
    this.animating = true;
    this.delay = delay || this.delay || 0;
    this.repeating = repeating || this.repeating || false;
    this.startAnimation();
  },
  _getStyles: function() {
    return {
      transition: this.styles.transition,
      transitionDuration: this.styles.transitionDuration,
      transitionProperty: this.styles.transitionProperty,
      transitionTimingFunction: this.styles.transisionTimingFunction,
      transform: this.styles.transform,
      opacity: this.styles.opacity
    };
  },
  _getAnim: function() {
    // This is to support backwards animations
    // It returns the original styles, with sane defaults
    if(this.index === -1) {
      let defaults = {
        transform: 'translate3d(0px, 0px, 0px)',
        scale: 1,
        transitionDuration: this.anims[0].transitionDuration,
        transitionTimingFunction: this.anims[0].transitionTimingFunction
      };
      let length = defaults.length,
          index = -1;
      while(++index < length) {
        let key = defaults[index];
        if(this.originalStyles[key] !== '') {
          defaults[key] = this.originalStyles[key];
        }
      }
      return defaults;
    } else {
      return this.anims[this.index];
    }
  }
};

export default Animate;
