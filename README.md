# This is a work in progress!!

Currently, it is working, but I can't yet guarantee this version works.

I ripped it out of a project, and I need to do a bit of cleaning up.

Following that:

* Adding support for prefixed css properties (it already supports the end events)
* A rewrite of the core logic. It's messy now
* And finally, when the above items are settled, a rehaul of the API.

Currently it requires instantiating an object, but I feel like the future is functional.

Animations will be defined as the arrays of objects currently used to instantiate them.

Pass in your elements and your animation and magic happens.

I considered (awhile back) supporting pausing/stopping etc (as well as CSS animations can), but that might be removed.

I could return an object to allow that functionality.

So many considerations...
