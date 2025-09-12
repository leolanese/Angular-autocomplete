# Angular Autocomplete (using Trie Data Structure)

You should implement an autocomplete component (suitable for a shared component library).

- Do not use any UI libraries such as Bootstrap/Material for the autocomplete logic/UI
- The UI shouldn't be fancy, but a nice-looking UI will be appreciated
- The component should be written using Angular
- Bonus - add meaningful unit tests for your work

To demonstrate it, we should write a minimal webserver in Go or Node.js that serves up the contents of world-cities.txt as required.

---

# Angular - Autocomplete

## Solution

> Combining a Trie, a Web Worker and Angular signals is a solid, modern way to deliver snappy autocomplete on a very large list of strings. Each piece solves a different bottleneck:

- Trie (algorithmic efficiency)
O(prefix length) lookup regardless of how many total words you store.
Stores common prefixes only once, so it scales better than an array of strings + filter.
Natural support for prefix-based limits (first 10 matches, etc.).

- Web Worker (main-thread isolation)
Building the trie and traversing it are CPU-bound; doing them off the main thread keeps scroll/tap/animation smooth.
Lets you work with hundreds of thousands of items without blocking change-detection.

- Signals (UI reactivity)
The component’s state (input() and suggestions()) is a pair of synchronous, garbage-free primitives — no RxJS boilerplate, no subscriptions to remember to tear down.
Effects run only when the signal they read changes, minimising view updates.
Fits the “derive everything, store nothing” philosophy: template simply calls suggestions().

---

Solution: large dataset
Node Server Running in :3000

```js
// run server
cd back-end && node .\server.js 

curl http://localhost:3000/world-cities.txt

http://localhost:3000/world-cities.txt
```

Angular client running :4200


## Demo:

![Demo](./src/app/assets/demo.png)

## unit-test

![ut](./src/app/assets/ut.png)

---

