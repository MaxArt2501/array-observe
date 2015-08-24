Array.observe polyfill
======================

This polyfill is actually meant to be a companion to the [Object.observe polyfill](https://github.com/MaxArt2501/object-observe) (or any other [`Object.observe`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe) shim that doesn't already support `Array.observe` and doesn't natively detect the `"splice"` event) and **it comes with a big warning** (read the [Under the hood](#under-the-hood) section).

The reason of this split is because of its obtrusive nature.


## Installation

This polyfill extends the native `Array` and doesn't have any dependencies, so loading it is pretty straightforward:

```html
<script src="array-observe.js"></script>
```

Use `array-observe.min.js` for the minified version.

Using bower (coming soon):

```bash
$ bower install array.observe
```

Or in node.js (coming soon):

```bash
$ npm install array.observe
```

The environment **must** already support `Object.observe` (either natively or via polyfill), or else the shim won't be installed.


## The "splice" event

According to the [spec](http://arv.github.io/ecmascript-object-observe/#Array.observe), `Array.observe` is basically like calling `Object.observe` with an `acceptTypes` option set to `[ "add", "update", "delete", "splice" ]`, where the first three types are already supported by the aforementioned polyfill, and the fourth one isn't.

The `"splice"` change can't be easily detected by a "dirty checking" loop (it can only be approximated by some kind of "distance" algorithm, which is usually computationally expensive) but, still according to the spec, it's triggered by certain array operations that modify the array itself. Namely, those are the `push`, `pop`, `shift`, `unshift` and `splice` methods, plus others like these:

```js
// Suppose beginning with `array` being an empty array

// Defining elements on indexes greater or equal to `array.length`
array[0] = "foo";

// Altering the `length` property (either increasing or decreasing it)
array.length = 3;

// Using `Object.assign`. The following will actually produce two separate
// "splice" events - basically equivalent to
//     array[3] = "bar";
//     array[4] = "baz";
Object.assign(array, { 3: "bar", 4: "baz" });
```

Additionally, the `"splice"` event is also triggered when one of the mentioned array methods are called on a non-array object:

```js
var object = {};

Array.prototype.push.call(object, "foo");
// => object === { 0: "foo", length: 1 }
```


## Under the hood

This polyfill wraps the native array `push`, `pop`, `shift`, `unshift` and `splice` methods so that they do a `performChange` call on the array's notifier. *It's precisely [what the spec says](http://arv.github.io/ecmascript-object-observe/#Array-changes) should happen*.

Unfortunately, this is certainly an obtrusive way to generate `"splice"` changes, not to mention it reduces the performance of said methods. Benchmarks show that wrapped methods are from 6 times (for `splice`) to 400 times slower (for `push`) - YMMV depending on the executing environment (see the [Benchmarks](#benchmarks) section later and some [results](benchmarks.md)).

In order to apply the polyfill also when calling array methods on generic objects, the methods are wrapped *directly on `Array.prototype`*, thus affecting *all* the arrays, even when not observed.

Moreover, this polyfill doesn't trigger a `"splice"` change when performing an array operation that does *not* use one of the above methods. That is handled normally in `Object.observe`, firing the usual `"add"`, `"update"` and `"delete"` events.

### Workaround for performance

If you don't want the array methods to be wrapped for *every* array, you can restore the original array methods using the `_original` property defined on the wrapped methods. You can attach the wrapped method only to the objects you want to observe, redefining `Array.observe` with something like this:

```js
var wrapped = {},
    methods = [ "push", "pop", "unshift", "shift", "splice" ];

// Restoring the original array methods, and saving the wrapped ones
methods.forEach(function(method) {
    wrapped[method] = Array.prototype[method];
    Array.prototype[method] = wrapped[method]._original;
});

Array.observe = (function(observe) {
    return function(array, handler) {
        // Applying the wrapped methods to the observed array
        methods.forEach(function(method) {
            if (method in array)
                array[method] = wrapped[method];
        });
        observe(array, handler);
    };
})(Array.observe);
```


## Tests

Tests are performed using [mocha](http://mochajs.org/) and assertions are made using [expect](https://github.com/Automattic/expect.js), which are set as development dependencies. Assuming you're in the project's root directory, if you want to run the tests after installing the package, just do

```bash
cd node_modules/array.observe
npm install
```

Then you can execute `npm run test` or, if you have mocha installed globally, just `mocha` from the package's root directory.

For client side testing, just open [index.html](test/index.html) in your browser of choice.


## Benchmarks

Some benchmarks have been created, using [benchmark.js](http://benchmarkjs.com/), testing the performances of the wrapped array methods (see some [results](benchmarks.md)).

After having installed the development dependencies (see above), open the [index.html](../benchmark/index.html) file in the benchmark/ directory in your browser of choice. To test node.js < 0.11.13, run `npm run benchmark`.

The benchmarks won't start if `Array.observe` is natively supported.


## License

MIT. See [LICENSE](LICENSE) for more details.
