import React, { useState, useCallback } from "react";

// ── DATA STORE ──────────────────────────────────────────────────────────────
const MASTER_QUESTIONS = {
  JavaScript: [
    { id: 101, topic: "JavaScript", difficulty: "hard", question: "Which statement best describes the 'Temporal Dead Zone' in JavaScript?", options: ["A. The time during which a variable is being garbage collected", "B. The period between entering a scope and the variable's declaration", "C. The delay between a Macrotask and a Microtask", "D. The phase where 'var' variables are hoisted to the top"], answer: "B", explanation: "Let and const are hoisted but not initialized; accessing them before the declaration line throws a ReferenceError." },
    { id: 102, topic: "JavaScript", difficulty: "hard", question: "In the event loop, when exactly does a 'queueMicrotask' callback execute?", options: ["A. Immediately after the current Macrotask but before UI rendering", "B. After the next requestAnimationFrame", "C. Simultaneously with setImmediate", "D. Only after the call stack and the Macrotask queue are empty"], answer: "A", explanation: "Microtasks are processed after the current task and before the browser is allowed to move on to the next task or render." },
    { id: 103, topic: "JavaScript", difficulty: "hard", question: "What is the primary architectural advantage of using a WeakMap over a standard Map?", options: ["A. WeakMaps allow for O(1) iteration of keys", "B. It prevents memory leaks by allowing keys to be garbage collected if not referenced elsewhere", "C. It supports primitive types as keys for better performance", "D. WeakMaps are automatically thread-safe in Node.js"], answer: "B", explanation: "WeakMap holds 'weak' references to objects, meaning if the object key has no other references, it can be cleared from memory." },
    { id: 104, topic: "JavaScript", difficulty: "hard", question: "What occurs during 'Monomorphic' optimization in the V8 engine?", options: ["A. A function is compiled for multiple different hidden classes", "B. V8 optimizes a function based on seeing only one consistent object shape", "C. The engine converts the code to WebAssembly", "D. Garbage collection is paused for that function"], answer: "B", explanation: "Monomorphic call sites are the fastest because the engine doesn't have to check for different object shapes (hidden classes)." },
    { id: 105, topic: "JavaScript", difficulty: "hard", question: "Consider: `console.log(0.1 + 0.2 === 0.3)`. Why is the result false?", options: ["A. JavaScript uses Base-10 math for decimals", "B. IEEE 754 floating-point representation causes precision loss", "C. The + operator coerces numbers to strings in decimals", "D. 0.3 is a reserved keyword in strict mode"], answer: "B", explanation: "Binary floating-point math results in 0.30000000000000004, which fails strict equality with 0.3." },
    { id: 106, topic: "JavaScript", difficulty: "hard", question: "What is the result of `typeof null` in JavaScript?", options: ["A. 'null'", "B. 'undefined'", "C. 'object'", "D. 'primitive'"], answer: "C", explanation: "This is a historical bug in JS where null was represented with a type tag shared with objects." },
    { id: 107, topic: "JavaScript", difficulty: "hard", question: "What happens when you 'await' a value that is not a Promise?", options: ["A. The engine throws a SyntaxError", "B. It is wrapped in Promise.resolve() and execution continues after a microtask", "C. The function becomes synchronous", "D. It causes a deadlock in the event loop"], answer: "B", explanation: "Await implicitly converts non-promise values into resolved promises, pushing the continuation into the microtask queue." },
    { id: 108, topic: "JavaScript", difficulty: "hard", question: "How does 'Strict Mode' handle a function called without an explicit 'this' context?", options: ["A. 'this' defaults to the window/global object", "B. 'this' becomes undefined", "C. 'this' becomes an empty object", "D. The function throws a ReferenceError"], answer: "B", explanation: "Strict mode prevents accidental modification of the global object by keeping 'this' as undefined." },
    { id: 109, topic: "JavaScript", difficulty: "hard", question: "What is the 'Structured Clone Algorithm' used for?", options: ["A. Deep copying objects for postMessage in Web Workers", "B. Comparing two objects for equality", "C. Minimizing JS bundles", "D. Compiling JS to Bytecode"], answer: "A", explanation: "It is the internal mechanism used to transfer complex data across workers and during IndexedDB operations." },
    { id: 110, topic: "JavaScript", difficulty: "hard", question: "What is logged?\n\nlet a = { n: 1 };\nlet b = a;\na.x = a = { n: 2 };\nconsole.log(a.x, b.x);", options: ["A. {n: 2}, {n: 2}", "B. undefined, {n: 2}", "C. {n: 2}, undefined", "D. undefined, undefined"], answer: "B", explanation: "The dot operator has higher precedence; the property 'x' is determined on the original object before reassignment." },
    { id: 111, topic: "JavaScript", difficulty: "hard", question: "What is a 'Thunk' in the context of functional JavaScript?", options: ["A. A recursive error", "B. A function that wraps an expression to delay its evaluation", "C. A minified variable", "D. A type of memory leak"], answer: "B", explanation: "Thunks are used to defer calculations or handle async logic by wrapping code in a function." },
    { id: 112, topic: "JavaScript", difficulty: "hard", question: "Why is 'Reflect.apply()' considered more robust than 'Function.prototype.apply()'?", options: ["A. It is 50% faster", "B. It avoids issues if the target object has its own 'apply' property shadowing the prototype", "C. It doesn't require a 'this' argument", "D. It automatically memoizes the result"], answer: "B", explanation: "As a static method, Reflect.apply is safer when dealing with objects that might have modified prototypes." },
    { id: 113, topic: "JavaScript", difficulty: "hard", question: "Which is a valid use case for 'Symbol.iterator'?", options: ["A. Making an object enumerable in for...in loops", "B. Defining custom behavior for for...of loops and the spread operator", "C. Creating private properties", "D. Preventing an object from being frozen"], answer: "B", explanation: "Symbol.iterator makes an object 'iterable' by defining how it should be traversed." },
    { id: 114, topic: "JavaScript", difficulty: "hard", question: "What happens if a promise is settled (resolved/rejected) multiple times?", options: ["A. It throws an error", "B. Only the first settlement counts; subsequent calls are ignored", "C. It updates the value each time", "D. It creates a chain of promises"], answer: "B", explanation: "Promises are state machines; once they transition from 'pending' to another state, they are immutable." },
    { id: 115, topic: "JavaScript", difficulty: "hard", question: "What is 'Tail Call Optimization' (TCO)?", options: ["A. Shortening the names of functions", "B. A memory optimization where the engine reuses the current stack frame for a return function call", "C. Pre-calculating the end of a loop", "D. Moving functions to the end of the script"], answer: "B", explanation: "TCO allows for infinite recursion in specific patterns without a stack overflow, though support is limited to Safari." },
    { id: 116, topic: "JavaScript", difficulty: "hard", question: "In a JS Proxy, what is a 'Trap'?", options: ["A. An intentional infinite loop", "B. A method that intercepts an internal operation (like 'get' or 'set')", "C. A security error", "D. A catch block for async code"], answer: "B", explanation: "Traps allow you to redefine the fundamental behavior of an object." },
    { id: 117, topic: "JavaScript", difficulty: "hard", question: "What is the difference between `Object.freeze()` and `Object.seal()`?", options: ["A. Freeze is for arrays, Seal is for objects", "B. Freeze makes properties read-only; Seal allows changing existing property values", "C. Seal prevents garbage collection", "D. There is no difference"], answer: "B", explanation: "Seal prevents adding/deleting properties but allows value updates; Freeze prevents everything." },
    { id: 118, topic: "JavaScript", difficulty: "hard", question: "Why is 'eval()' considered dangerous and slow?", options: ["A. It bypasses the event loop", "B. It forces the engine to disable many optimizations because it can change scope at runtime", "C. It only works in Node.js", "D. It converts JS to CSS"], answer: "B", explanation: "Dynamic execution prevents the engine from performing static analysis and JIT optimizations." },
    { id: 119, topic: "JavaScript", difficulty: "hard", question: "What is the primary purpose of 'Atomics' in JavaScript?", options: ["A. To create small variables", "B. To manage thread-safe operations on SharedArrayBuffer", "C. To speed up DOM manipulation", "D. To handle atomic CSS classes"], answer: "B", explanation: "Atomics ensure that memory operations between the main thread and Workers don't suffer from race conditions." },
    { id: 120, topic: "JavaScript", difficulty: "hard", question: "What does 'Array.prototype.flat(Infinity)' do?", options: ["A. Deletes all elements", "B. Recursively flattens a nested array into a single-level array", "C. Removes duplicates", "D. Sorts the array"], answer: "B", explanation: "It collapses all sub-arrays into one, regardless of depth." },
    { id: 121, topic: "JavaScript", difficulty: "hard", question: "How does the 'this' keyword behave in an arrow function?", options: ["A. It is bound to the element that triggered the event", "B. It is lexically inherited from the surrounding scope", "C. It is always undefined", "D. It refers to the function itself"], answer: "B", explanation: "Arrow functions do not have their own 'this' context; they capture it from the parent scope." },
    { id: 122, topic: "JavaScript", difficulty: "hard", question: "What is the 'BigInt' type used for?", options: ["A. To store very long strings", "B. To represent integers larger than 2^53 - 1", "C. To improve floating-point math", "D. To count the number of objects"], answer: "B", explanation: "Standard numbers use 64-bit floats; BigInt allows for arbitrary-precision integers." },
    { id: 123, topic: "JavaScript", difficulty: "hard", question: "What happens when you use 'delete' on a property that is part of the prototype chain?", options: ["A. It deletes it from the prototype", "B. It does nothing to the prototype; it only deletes 'own' properties", "C. It throws a TypeError", "D. It hides the property from loops"], answer: "B", explanation: "The delete operator only affects the object it is called on, not its prototype." },
    { id: 124, topic: "JavaScript", difficulty: "hard", question: "What is 'Function Arity'?", options: ["A. The speed of the function", "B. The number of formal parameters a function expects", "C. The memory usage of a function", "D. The nesting depth"], answer: "B", explanation: "Accessed via func.length, arity indicates the number of arguments expected by the function." },
    { id: 125, topic: "JavaScript", difficulty: "hard", question: "Which statement about 'CommonJS' vs 'ES Modules' is true?", options: ["A. CommonJS supports top-level await", "B. ES Modules are statically analyzed and allow for tree-shaking", "C. ES Modules are loaded synchronously", "D. There is no difference"], answer: "B", explanation: "ESM structure is determined at compile time, enabling tools to remove unused code (tree-shaking)." }
  ],
  React: [
    { id: 201, topic: "React", difficulty: "hard", question: "In React 18, what is the primary purpose of 'useTransition'?", options: ["A. To animate CSS transitions", "B. To mark a state update as non-urgent and interruptible", "C. To fetch data from a server", "D. To transition between routes"], answer: "B", explanation: "It prevents 'blocking' renders, keeping the UI responsive (e.g., during heavy list filtering)." },
    { id: 202, topic: "React", difficulty: "hard", question: "Why does React require you to return a new object reference for state (Immutability)?", options: ["A. To save memory", "B. To enable cheap 'shallow comparison' check for re-rendering", "C. Because JS doesn't support mutable objects", "D. To allow automatic deep-cloning"], answer: "B", explanation: "React uses Object.is() to check if state changed; comparing references is O(1), while comparing contents is O(N)." },
    { id: 203, topic: "React", difficulty: "hard", question: "What is a 'Fiber' in React's internal architecture?", options: ["A. A CSS-in-JS library", "B. A unit of work that allows the renderer to split and prioritize updates", "C. A type of network request", "D. A replacement for the Virtual DOM"], answer: "B", explanation: "Fiber allows React to pause work and return to it later, enabling Concurrent features." },
    { id: 204, topic: "React", difficulty: "hard", question: "What happens if you use a Hook inside a conditional if-statement?", options: ["A. It works but is slower", "B. It breaks React's ability to track Hook state correctly across renders", "C. It only runs if the condition is true", "D. It throws a SyntaxError"], answer: "B", explanation: "React relies on the call order of Hooks. Changing the order causes it to associate the wrong state with the wrong Hook." },
    { id: 205, topic: "React", difficulty: "hard", question: "How does 'useDeferredValue' differ from 'debouncing'?", options: ["A. It uses a fixed timer", "B. It is integrated with React's scheduler and triggers as soon as the main thread is free", "C. It only works with strings", "D. It is purely for CSS"], answer: "B", explanation: "Unlike debouncing (which waits X ms), deferred values trigger immediately after the 'urgent' render finishes." },
    { id: 206, topic: "React", difficulty: "hard", question: "What is the 'Hydration Mismatch' error in SSR?", options: ["A. When the server is faster than the client", "B. When the server-rendered HTML differs from the first client-side render", "C. When a database is down", "D. When images are not loaded"], answer: "B", explanation: "React requires the client's initial render to match the server's HTML to attach event listeners correctly." },
    { id: 207, topic: "React", difficulty: "hard", question: "Why is 'useLayoutEffect' generally discouraged compared to 'useEffect'?", options: ["A. It doesn't support clean-up functions", "B. It is synchronous and blocks the browser from painting", "C. It is deprecated in React 18", "D. It only works in Class components"], answer: "B", explanation: "useLayoutEffect blocks the UI until the code finishes; use it only for measuring DOM elements to prevent flickering." },
    { id: 208, topic: "React", difficulty: "hard", question: "What is the purpose of 'forwardRef'?", options: ["A. To pass a ref through a component to one of its children", "B. To speed up rendering", "C. To make a component 'pure'", "D. To handle API errors"], answer: "A", explanation: "Functional components don't expose refs by default; forwardRef allows a parent to access a child's DOM node." },
    { id: 209, topic: "React", difficulty: "hard", question: "In Concurrent React, what is 'Selective Hydration'?", options: ["A. Hydrating only the CSS", "B. Prioritizing hydration for the part of the page the user interacts with first", "C. Disabling hydration on mobile", "D. Hydrating only the footer"], answer: "B", explanation: "React can start hydrating a component early if a user clicks on it, even if other parts are still loading." },
    { id: 210, topic: "React", difficulty: "hard", question: "What defines a 'Higher-Order Component' (HOC)?", options: ["A. A component with many children", "B. A function that takes a component and returns a new component", "C. A component at the top of the tree", "D. A hook that uses state"], answer: "B", explanation: "HOCs are a pattern for reusing component logic by wrapping them in a wrapper function." },
    { id: 211, topic: "React", difficulty: "hard", question: "What is the risk of using 'index' as a key in a dynamic list?", options: ["A. It will crash the app", "B. Reordering items can cause state bugs and performance issues", "C. Keys must be strings, not numbers", "D. There is no risk"], answer: "B", explanation: "React uses keys to identify elements. If the list shifts, using the index can lead to the wrong component state being shown." },
    { id: 212, topic: "React", difficulty: "hard", question: "What does 'React.memo' compare by default?", options: ["A. Deep equality of props", "B. Shallow equality of props", "C. Only the 'id' prop", "D. It compares the state"], answer: "B", explanation: "It uses Object.is() on props to determine if it can skip a re-render." },
    { id: 213, topic: "React", difficulty: "hard", question: "When using 'useReducer', what is the 'Dispatch' function?", options: ["A. A function that triggers a re-render with a new action", "B. A method to fetch data", "C. A CSS-in-JS tool", "D. A way to delete state"], answer: "A", explanation: "Dispatch sends an action to the reducer to calculate the next state." },
    { id: 214, topic: "React", difficulty: "hard", question: "What is the 'Children' prop in React?", options: ["A. A count of child components", "B. A special prop that contains whatever is passed between opening/closing tags", "C. A method to create new nodes", "D. A reference to the parent"], answer: "B", explanation: "It allows for component composition (nesting components inside each other)." },
    { id: 215, topic: "React", difficulty: "hard", question: "What occurs if an Error Boundary is not defined and a component crashes?", options: ["A. React skips that component", "B. The entire React component tree is unmounted (white screen)", "C. The browser reloads automatically", "D. Only the header crashes"], answer: "B", explanation: "Since React 16, errors not caught by a boundary result in unmounting the whole app." },
    { id: 216, topic: "React", difficulty: "hard", question: "What is a 'Portal' used for?", options: ["A. Navigating to a new site", "B. Rendering a component into a DOM node outside its parent hierarchy", "C. Optimizing image loads", "D. Server-side data fetching"], answer: "B", explanation: "Portals are essential for Modals/Tooltips to avoid z-index or 'overflow: hidden' issues." },
    { id: 217, topic: "React", difficulty: "hard", question: "What is 'Strict Mode' meant to catch in development?", options: ["A. Syntax errors", "B. Side effects occurring during the render phase (Impurity)", "C. Slow network requests", "D. CSS invalidity"], answer: "B", explanation: "By double-rendering components, it helps find bugs where code isn't idempotent or causes memory leaks." },
    { id: 218, topic: "React", difficulty: "hard", question: "How do you 'reset' a component's internal state from the parent?", options: ["A. By calling a 'reset' method", "B. By changing the 'key' prop of the component", "C. By setting props to null", "D. State cannot be reset from a parent"], answer: "B", explanation: "Changing the 'key' forces React to unmount the old component and mount a fresh one with new state." },
    { id: 219, topic: "React", difficulty: "hard", question: "What is the benefit of the 'useCallback' hook?", options: ["A. It makes functions run faster", "B. It memoizes a function instance to prevent unnecessary re-renders of children using memo", "C. It replaces useEffect", "D. It handles API calls"], answer: "B", explanation: "It ensures a function reference stays the same across renders unless its dependencies change." },
    { id: 220, topic: "React", difficulty: "hard", question: "What does 'Suspense' do for code-splitting?", options: ["A. It minifies the code", "B. It allows you to show a fallback UI while a lazy-loaded component is being fetched", "C. It prevents the code from loading on mobile", "D. It combines multiple files"], answer: "B", explanation: "Suspense coordinates the loading state of React.lazy() components." },
    { id: 221, topic: "React", difficulty: "hard", question: "What is 'Prop Drilling'?", options: ["A. A performance optimization", "B. The process of passing data through many layers of components that don't need it", "C. A way to inject CSS", "D. Using props to fetch data"], answer: "B", explanation: "It can make code hard to maintain; solutions include Context API or State Management libraries." },
    { id: 222, topic: "React", difficulty: "hard", question: "In useReducer, what is an 'Action'?", options: ["A. A DOM event", "B. An object describing what happened (usually with a 'type' property)", "C. A CSS animation", "D. A promise"], answer: "B", explanation: "Actions are the only way to trigger state changes in the reducer pattern." },
    { id: 223, topic: "React", difficulty: "hard", question: "Which statement about Context API is true?", options: ["A. It is a full replacement for Redux/Zustand", "B. Any change to the Provider's value causes all consumers to re-render", "C. It only supports string data", "D. It is faster than local state"], answer: "B", explanation: "Context is great for low-frequency updates (themes/auth) but can be slow for high-frequency updates due to mass re-rendering." },
    { id: 224, topic: "React", difficulty: "hard", question: "What is 'Lifting State Up'?", options: ["A. Moving state to the global window object", "B. Moving state to a common ancestor so multiple children can share it", "C. Deleting local state", "D. Storing state in a database"], answer: "B", explanation: "This ensures 'one source of truth' for components that need to stay in sync." },
    { id: 225, topic: "React", difficulty: "hard", question: "What is the 'SyntheticEvent' in React?", options: ["A. A fake event for testing", "B. A cross-browser wrapper around the native DOM event", "C. An event triggered by CSS", "D. A server-side event"], answer: "B", explanation: "React uses these to ensure consistent event behavior across different browsers." }
  ],
  HTML: [
    { id: 301, topic: "HTML", difficulty: "hard", question: "How does the 'defer' attribute affect script execution?", options: ["A. It runs the script immediately while parsing", "B. It downloads the script in parallel and executes it only after the DOM is fully parsed", "C. It stops the parser until the script is finished", "D. It ignores the script on mobile"], answer: "B", explanation: "Defer is non-blocking and maintains the order of scripts relative to each other." },
    { id: 302, topic: "HTML", difficulty: "hard", question: "What is the purpose of the 'nonce' attribute in a script tag?", options: ["A. For SEO", "B. To authorize a script to run under a strict Content Security Policy (CSP)", "C. To set a unique name for the script", "D. To prevent caching"], answer: "B", explanation: "A 'nonce' (number used once) prevents attackers from injecting and running malicious inline scripts." },
    { id: 303, topic: "HTML", difficulty: "hard", question: "Which attribute identifies an image as decorative so screen readers skip it?", options: ["A. alt='decorative'", "B. alt='' (empty string)", "C. aria-hidden='false'", "D. hidden"], answer: "B", explanation: "An empty alt attribute tells accessibility tools that the image is not meaningful content." },
    { id: 304, topic: "HTML", difficulty: "hard", question: "What does the 'preload' value for the <link> tag accomplish?", options: ["A. It executes a script early", "B. It tells the browser to fetch a high-priority resource as soon as possible", "C. It reloads the page", "D. It clears the cache"], answer: "B", explanation: "Preloading is used for critical resources like fonts or hero images to improve LCP." },
    { id: 305, topic: "HTML", difficulty: "hard", question: "What is the 'Shadow DOM'?", options: ["A. A hidden backup of the DOM", "B. An encapsulated DOM tree that is separate from the main document DOM", "C. A CSS-only feature", "D. A tool for tracking user clicks"], answer: "B", explanation: "Shadow DOM allows developers to build components with private styles and internal structure." },
    { id: 306, topic: "HTML", difficulty: "hard", question: "What is the difference between <dialog>.show() and <dialog>.showModal()?", options: ["A. No difference", "B. showModal() creates a backdrop and prevents interaction with the rest of the page", "C. show() is only for mobile", "D. showModal() is only for videos"], answer: "B", explanation: "showModal() is the standard way to create an accessible, focus-trapped modal dialog." },
    { id: 307, topic: "HTML", difficulty: "hard", question: "What is 'Semantic HTML'?", options: ["A. HTML that looks pretty", "B. Using tags that describe their meaning (e.g., <article>) rather than appearance", "C. Coding in a specific language", "D. Using only <div> and <span>"], answer: "B", explanation: "Semantic tags improve SEO, maintainability, and accessibility by providing context to the browser." },
    { id: 308, topic: "HTML", difficulty: "hard", question: "What is the purpose of the <meta name='viewport'> tag?", options: ["A. To track the user's location", "B. To control how the page is scaled and sized on different screens", "C. To set the background color", "D. To define keywords for SEO"], answer: "B", explanation: "Without it, mobile browsers assume a desktop width and scale the page down, ruining UX." },
    { id: 309, topic: "HTML", difficulty: "hard", question: "What is the 'rel=noopener' attribute used for?", options: ["A. SEO optimization", "B. Security: it prevents the new page from accessing the 'window.opener' of the previous page", "C. Faster page loads", "D. Tracking clicks"], answer: "B", explanation: "It is a critical security measure when using target='_blank'." },
    { id: 310, topic: "HTML", difficulty: "hard", question: "Which HTML5 element is used to draw graphics on the fly via JavaScript?", options: ["A. <svg>", "B. <canvas>", "C. <paint>", "D. <image>"], answer: "B", explanation: "Canvas provides a resolution-dependent bitmap area for scripted drawing." },
    { id: 311, topic: "HTML", difficulty: "hard", question: "What does the 'loading=lazy' attribute do for an <img> tag?", options: ["A. It blurs the image", "B. It defers loading the image until it is close to the viewport", "C. It reduces the image quality", "D. It only works on 4G"], answer: "B", explanation: "Native lazy loading significantly improves initial page load speed and bandwidth usage." },
    { id: 312, topic: "HTML", difficulty: "hard", question: "What is the 'integrity' attribute used for on <script> tags?", options: ["A. To check the author's name", "B. To verify that the fetched file hasn't been tampered with (Subresource Integrity)", "C. To make the script run faster", "D. To ensure the script is unique"], answer: "B", explanation: "It uses a cryptographic hash to ensure the CDN file is exactly what you expected." },
    { id: 313, topic: "HTML", difficulty: "hard", question: "What is a 'Void Element'?", options: ["A. An element that returns null", "B. An element that cannot have children and doesn't need a closing tag (e.g. <br>)", "C. A hidden div", "D. An empty script"], answer: "B", explanation: "Void elements are self-closing by definition in HTML5." },
    { id: 314, topic: "HTML", difficulty: "hard", question: "What is the purpose of the <fieldset> tag?", options: ["A. To create a 3D effect", "B. To group related elements in a form for better organization and accessibility", "C. To set a background for the page", "D. To define a database field"], answer: "B", explanation: "It is often used with <legend> to provide a clear title for a group of inputs." },
    { id: 315, topic: "HTML", difficulty: "hard", question: "What does the 'aria-live' attribute accomplish?", options: ["A. It streams live video", "B. It informs screen readers to announce content updates dynamically", "C. It keeps the page from timing out", "D. It is a CSS animation trigger"], answer: "B", explanation: "It is essential for accessible SPAs where content changes without a full page reload." },
    { id: 316, topic: "HTML", difficulty: "hard", question: "How does <script type='module'> differ from standard scripts?", options: ["A. It is always deferred by default", "B. It cannot use 'import' statements", "C. It runs in the global scope", "D. It is faster on IE11"], answer: "A", explanation: "Modules are automatically non-blocking and support scoped variable definitions." },
    { id: 317, topic: "HTML", difficulty: "hard", question: "What is the purpose of the 'manifest.json' file?", options: ["A. To list all JS files", "B. To provide metadata for a Progressive Web App (PWA) installation", "C. To store user passwords", "D. To define CSS variables"], answer: "B", explanation: "It defines how the app appears when installed on a home screen (icons, theme color, etc.)." },
    { id: 318, topic: "HTML", difficulty: "hard", question: "Which tag is used to provide a caption for a <figure> element?", options: ["A. <caption>", "B. <figcaption>", "C. <label>", "D. <title>"], answer: "B", explanation: "Figcaption provides a semantic description for the associated media." },
    { id: 319, topic: "HTML", difficulty: "hard", question: "What is the 'action' attribute on a <form> tag?", options: ["A. The JS function to execute", "B. The URL where form data should be submitted", "C. The CSS animation to play", "D. The button text"], answer: "B", explanation: "It defines the endpoint for the HTTP request triggered by form submission." },
    { id: 320, topic: "HTML", difficulty: "hard", question: "What is the 'main' tag used for?", options: ["A. To wrap the whole page", "B. To represent the dominant content of the body", "C. To define the navigation menu", "D. To set the footer"], answer: "B", explanation: "There should only be one non-hidden <main> element per document." },
    { id: 321, topic: "HTML", difficulty: "hard", question: "What does 'inputmode=numeric' do on mobile devices?", options: ["A. It converts text to numbers", "B. It prompts the device to show a numeric keypad", "C. It prevents letters from being typed", "D. It is only for passwords"], answer: "B", explanation: "It is a UX enhancement for inputs like ZIP codes or credit card numbers." },
    { id: 322, topic: "HTML", difficulty: "hard", question: "Which is the correct semantic element for a sidebar?", options: ["A. <section>", "B. <aside>", "C. <article>", "D. <div>"], answer: "B", explanation: "Aside represents content that is indirectly related to the main content." },
    { id: 323, topic: "HTML", difficulty: "hard", question: "What is the purpose of the <base> tag?", options: ["A. To define the default font", "B. To set a base URL for all relative URLs in a document", "C. To set the background", "D. To define the footer"], answer: "B", explanation: "It must be placed in the <head> and affects every relative link on the page." },
    { id: 324, topic: "HTML", difficulty: "hard", question: "What is the 'data-' attribute used for?", options: ["A. To link to a database", "B. To store custom private data for the page or application", "C. To set the language", "D. To define CSS classes"], answer: "B", explanation: "It allows you to embed extra information on standard HTML elements for use in JS." },
    { id: 325, topic: "HTML", difficulty: "hard", question: "Which attribute prevents a browser from automatically translating a page?", options: ["A. translate='no'", "B. lang='none'", "C. no-translate", "D. secret='true'"], answer: "A", explanation: "The translate attribute can be used to protect brand names or specific code snippets." }
  ],
  CSS: [
    { id: 401, topic: "CSS", difficulty: "hard", question: "Which property creates a new 'Stacking Context'?", options: ["A. color: red", "B. opacity: 0.99", "C. font-size: 16px", "D. margin-top: 10px"], answer: "B", explanation: "Properties like opacity < 1, transform, and filter promote an element to its own layer." },
    { id: 402, topic: "CSS", difficulty: "hard", question: "How does 'flex-basis' differ from 'width'?", options: ["A. They are the same", "B. flex-basis defines size along the main-axis; width is strictly horizontal", "C. width always overrides flex-basis", "D. flex-basis is only for Grid"], answer: "B", explanation: "If flex-direction is column, flex-basis actually controls the height." },
    { id: 403, topic: "CSS", difficulty: "hard", question: "What occurs when you apply 'will-change: transform' to an element?", options: ["A. It animates immediately", "B. It hints to the browser to promote the element to its own compositor layer for GPU acceleration", "C. It changes the CSS syntax", "D. It forces a re-render"], answer: "B", explanation: "This optimizes performance but should be used sparingly to avoid high memory usage." },
    { id: 404, topic: "CSS", difficulty: "hard", question: "What is the 'CSS Specificity' of an ID selector?", options: ["A. 0, 1, 0, 0", "B. 1, 0, 0, 0", "C. 0, 0, 1, 0", "D. 0, 0, 0, 1"], answer: "A", explanation: "IDs have a higher specificity than classes (0,0,1,0) and elements (0,0,0,1)." },
    { id: 405, topic: "CSS", difficulty: "hard", question: "What is the difference between 'em' and 'rem' units?", options: ["A. em is relative to the parent; rem is relative to the root (html) element", "B. rem is for padding; em for font size", "C. em is faster to calculate", "D. There is no difference"], answer: "A", explanation: "rem (root em) provides a consistent scale across the whole document." },
    { id: 406, topic: "CSS", difficulty: "hard", question: "What does 'box-sizing: border-box' accomplish?", options: ["A. Adds a border to every element", "B. Includes padding and border in the element's total width/height", "C. Makes the box invisible", "D. Removes the margin"], answer: "B", explanation: "This makes layout calculations much more predictable for developers." },
    { id: 407, topic: "CSS", difficulty: "hard", question: "What is 'CSS Containment' (the contain property)?", options: ["A. A security feature", "B. It isolates a subtree from the rest of the page to limit the scope of layout and paint", "C. It centers a div", "D. It groups CSS files"], answer: "B", explanation: "The 'contain' property is a massive performance optimization for complex UIs." },
    { id: 408, topic: "CSS", difficulty: "hard", question: "How does the ':has()' selector work?", options: ["A. It checks if an element has a specific ID", "B. It is a parent selector that styles an element based on its descendants", "C. It checks for CSS variables", "D. It is for mobile only"], answer: "B", explanation: "The ':has()' selector is a game-changer that allows conditional styling based on children." },
    { id: 409, topic: "CSS", difficulty: "hard", question: "What is the 'BEM' methodology intended to solve?", options: ["A. Slow CSS performance", "B. Specificity wars and unmaintainable global naming", "C. Lack of CSS variables", "D. Image loading speeds"], answer: "B", explanation: "Block-Element-Modifier provides a strict naming convention to keep CSS modular." },
    { id: 410, topic: "CSS", difficulty: "hard", question: "Which unit is 1% of the viewport height?", options: ["A. vw", "B. vh", "C. rem", "D. %"], answer: "B", explanation: "vh stands for Viewport Height." },
    { id: 411, topic: "CSS", difficulty: "hard", question: "What does 'object-fit: cover' do to an <img>?", options: ["A. It blurs the image", "B. It scales the image to fill its container while maintaining aspect ratio (cropping if needed)", "C. It stretches the image", "D. It hides the image"], answer: "B", explanation: "This mimics the behavior of background-size: cover for <img> and <video> tags." },
    { id: 412, topic: "CSS", difficulty: "hard", question: "What is 'Layout Thrashing' in the context of CSS/JS?", options: ["A. Deleting all styles", "B. Repeatedly reading and writing DOM properties that force browser reflows", "C. A CSS animation", "D. A type of grid"], answer: "B", explanation: "Reading offsetWidth after a style change forces the browser to recalculate layout immediately." },
    { id: 413, topic: "CSS", difficulty: "hard", question: "What is 'Subgrid' in CSS Grid?", options: ["A. A smaller grid inside a cell", "B. A feature that allows nested grids to inherit the track definition of the parent grid", "C. A CSS framework", "D. A mobile-only layout"], answer: "B", explanation: "Subgrid allows children of grid items to align perfectly with the main grid's tracks." },
    { id: 414, topic: "CSS", difficulty: "hard", question: "What does 'position: sticky' do?", options: ["A. Fixed always", "B. Relative until it crosses a threshold, then acts as 'fixed' within its parent", "C. Sticks to other elements", "D. Floating"], answer: "B", explanation: "Sticky is a hybrid of relative and fixed positioning." },
    { id: 415, topic: "CSS", difficulty: "hard", question: "What is the 'aspect-ratio' property used for?", options: ["A. Image quality", "B. Ensuring an element maintains its proportions regardless of size", "C. Z-index scaling", "D. Font size"], answer: "B", explanation: "It replaces the old 'padding-bottom' hack for creating proportional boxes." },
    { id: 416, topic: "CSS", difficulty: "hard", question: "What is a 'Pseudo-element' (e.g. ::before)?", options: ["A. A fake CSS class", "B. A way to style or insert content into a specific part of an element without HTML", "C. A JS variable", "D. A hidden div"], answer: "B", explanation: "Pseudo-elements create nodes in the CSS tree that aren't in the DOM." },
    { id: 417, topic: "CSS", difficulty: "hard", question: "What is the 'gap' property used for?", options: ["A. Margin on the body", "B. Spacing between items in Flexbox and Grid", "C. To create a hole in a div", "D. Letter spacing"], answer: "B", explanation: "Gap is cleaner than margin because it only applies space *between* items." },
    { id: 418, topic: "CSS", difficulty: "hard", question: "What does 'pointer-events: none' do?", options: ["A. Disables the mouse", "B. Makes an element 'pass-through' for clicks, affecting whatever is behind it", "C. Changes the cursor", "D. Speeds up clicking"], answer: "B", explanation: "The element remains visible but stops intercepting mouse/touch interactions." },
    { id: 419, topic: "CSS", difficulty: "hard", question: "What is a 'CSS Variable' (Custom Property)?", options: ["A. A SASS variable", "B. A native dynamic variable that can be changed via JS at runtime", "C. A constant number", "D. A type of font"], answer: "B", explanation: "Native variables (--var) follow the cascade and are more powerful than preprocessor variables." },
    { id: 420, topic: "CSS", difficulty: "hard", question: "What is 'isolation: isolate' used for?", options: ["A. Security", "B. Creating a new stacking context without requiring z-index or position", "C. Hiding an element", "D. Stopping JS"], answer: "B", explanation: "It prevents z-index pollution by containing sub-layers within that element." },
    { id: 421, topic: "CSS", difficulty: "hard", question: "What is the 'calc()' function?", options: ["A. A calculator app", "B. A way to perform math (e.g. mixing units) directly in CSS values", "C. A JS tool", "D. For numbers only"], answer: "B", explanation: "calc() allows logic like '100% - 20px' in your layout." },
    { id: 422, topic: "CSS", difficulty: "hard", question: "What does 'display: contents' do?", options: ["A. Hides the element", "B. Removes the element's box but keeps the children in the layout", "C. Centers text", "D. Shows a list"], answer: "B", explanation: "The children of the element behave as if they were direct children of the element's parent." },
    { id: 423, topic: "CSS", difficulty: "hard", question: "What is the 'grid-template-areas' property used for?", options: ["A. Setting background images", "B. Creating a visual map of the grid using named sections", "C. Defining font sizes", "D. Measuring the page"], answer: "B", explanation: "It provides a highly readable way to define complex layouts." },
    { id: 424, topic: "CSS", difficulty: "hard", question: "What is 'Cascading' in CSS?", options: ["A. Code falling down", "B. The algorithm that determines which style rules apply to an element", "C. A type of animation", "D. A file structure"], answer: "B", explanation: "It considers importance, specificity, and source order." },
    { id: 425, topic: "CSS", difficulty: "hard", question: "What is 'Media Query Level 4' container queries?", options: ["A. Faster mobile CSS", "B. Styling elements based on the size of their parent container instead of the viewport", "C. A new grid type", "D. A JS library"], answer: "B", explanation: "Container queries enable truly modular components that look right regardless of where they are placed." }
  ],
  Logical: [
    { id: 501, topic: "Logical", difficulty: "hard", question: "What is the Big O complexity of 'Binary Search'?", options: ["A. O(n)", "B. O(log n)", "C. O(n^2)", "D. O(1)"], answer: "B", explanation: "Binary search halves the search area with each step, making it extremely efficient." },
    { id: 502, topic: "Logical", difficulty: "hard", question: "Which data structure is 'First-In-First-Out' (FIFO)?", options: ["A. Stack", "B. Queue", "C. Tree", "D. Map"], answer: "B", explanation: "Queues process items in the order they arrived, like a line at a store." },
    { id: 503, topic: "Logical", difficulty: "hard", question: "What is the complexity of a Hash Map lookup (average case)?", options: ["A. O(n)", "B. O(1)", "C. O(log n)", "D. O(n^2)"], answer: "B", explanation: "Hash maps provide constant-time access by using a key to jump directly to data." },
    { id: 504, topic: "Logical", difficulty: "hard", question: "What is 'Memoization'?", options: ["A. Taking notes", "B. Caching the results of expensive function calls to avoid repeated work", "C. Deleting old code", "D. A CSS property"], answer: "B", explanation: "Memoization trades memory for speed by storing previous function outputs." },
    { id: 505, topic: "Logical", difficulty: "hard", question: "In a 'Trie' (prefix tree), what is the primary optimization?", options: ["A. Math speed", "B. Efficient prefix-based string lookups (like autocomplete)", "C. Image compression", "D. Sorting numbers"], answer: "B", explanation: "Tries are optimized for searching through datasets of strings sharing common beginnings." },
    { id: 506, topic: "Logical", difficulty: "hard", question: "What is the time complexity of 'Merge Sort'?", options: ["A. O(n)", "B. O(n log n)", "C. O(n^2)", "D. O(log n)"], answer: "B", explanation: "Merge sort is a consistent divide-and-conquer algorithm with O(n log n) performance." },
    { id: 507, topic: "Logical", difficulty: "hard", question: "What does 'LIFO' stand for?", options: ["A. Last In, First Out", "B. List In Final Order", "C. Low Index, Fast Output", "D. Left In, Front Out"], answer: "A", explanation: "LIFO describes the behavior of a Stack (like a stack of plates)." },
    { id: 508, topic: "Logical", difficulty: "hard", question: "What is 'Currying' in functional programming?", options: ["A. A type of food", "B. Transforming a function with multiple arguments into a sequence of nested functions", "C. Deleting a function", "D. Naming variables"], answer: "B", explanation: "Currying allows for partial application of functions." },
    { id: 509, topic: "Logical", difficulty: "hard", question: "What is a 'Pure Function'?", options: ["A. A function with no parameters", "B. A function that always returns the same output for the same input and has no side effects", "C. A built-in JS function", "D. A function that doesn't use variables"], answer: "B", explanation: "Pure functions are the foundation of reliable, testable code." },
    { id: 510, topic: "Logical", difficulty: "hard", question: "What is a 'Race Condition'?", options: ["A. A fast API", "B. When the final state of a program depends on the timing or order of async events", "C. A CSS animation", "D. A typing test"], answer: "B", explanation: "Race conditions lead to unpredictable bugs in asynchronous code." },
    { id: 511, topic: "Logical", difficulty: "hard", question: "What is 'Big O' notation used for?", options: ["A. Naming variables", "B. Measuring the efficiency (time/space) of an algorithm as the input grows", "C. Setting font sizes", "D. Tracking user clicks"], answer: "B", explanation: "It provides a mathematical way to describe how code performance scales." },
    { id: 512, topic: "Logical", difficulty: "hard", question: "Which algorithm is used for finding the shortest path in a weighted graph?", options: ["A. Binary Search", "B. Dijkstra's Algorithm", "C. Bubble Sort", "D. Depth-First Search"], answer: "B", explanation: "Dijkstra's is the standard algorithm for network routing and map navigation." },
    { id: 513, topic: "Logical", difficulty: "hard", question: "What is 'Recursion'?", options: ["A. A loop that never ends", "B. A function that calls itself to solve a smaller version of the same problem", "C. A CSS layout", "D. A way to import files"], answer: "B", explanation: "Recursion requires a base case to prevent a stack overflow." },
    { id: 514, topic: "Logical", difficulty: "hard", question: "What is the complexity of adding to the start of an Array (O(n))?", options: ["A. O(1)", "B. O(n)", "C. O(log n)", "D. O(n^2)"], answer: "B", explanation: "The engine must shift every other element to a new index when the first index changes." },
    { id: 515, topic: "Logical", difficulty: "hard", question: "What is a 'Binary Search Tree' (BST)?", options: ["A. A list of 2 items", "B. A tree where every node's left child is smaller and right child is larger", "C. A JS file", "D. A binary number"], answer: "B", explanation: "The sorted nature of a BST allows for O(log n) search, insertion, and deletion." },
    { id: 516, topic: "Logical", difficulty: "hard", question: "What is 'Immutability'?", options: ["A. Data that cannot be changed after it is created", "B. A type of font", "C. A slow database", "D. A CSS property"], answer: "A", explanation: "Immutability prevents bugs caused by unexpected state changes." },
    { id: 517, topic: "Logical", difficulty: "hard", question: "What is the 'Base Case' in recursion?", options: ["A. The starting point", "B. The condition that stops the recursion from continuing infinitely", "C. The memory limit", "D. The function name"], answer: "B", explanation: "Without a base case, recursion results in a 'RangeError: Maximum call stack size exceeded'." },
    { id: 518, topic: "Logical", difficulty: "hard", question: "What is 'Idempotency' in the context of APIs?", options: ["A. Speed", "B. The property where making the same request multiple times has the same effect as once", "C. Security", "D. User interface design"], answer: "B", explanation: "Idempotent requests (like GET or PUT) are safer for retrying after network failures." },
    { id: 519, topic: "Logical", difficulty: "hard", question: "Which gate returns true if both inputs are DIFFERENT?", options: ["A. AND", "B. OR", "C. XOR", "D. NAND"], answer: "C", explanation: "Exclusive OR (XOR) is true only if the inputs do not match." },
    { id: 520, topic: "Logical", difficulty: "hard", question: "What is the 'Time-Space Trade-off'?", options: ["A. Buying a new computer", "B. Using more memory to achieve faster processing speed (e.g. Caching)", "C. Deleting old files", "D. Working overtime"], answer: "B", explanation: "Many algorithms use extra data structures (space) to avoid expensive recalculations (time)." },
    { id: 521, topic: "Logical", difficulty: "hard", question: "What is a 'Circular Dependency'?", options: ["A. A loop in code", "B. When two modules/files depend on each other, potentially breaking the build", "C. A CSS flex setting", "D. An API error"], answer: "B", explanation: "This often leads to 'undefined' values because the modules cannot fully initialize." },
    { id: 522, topic: "Logical", difficulty: "hard", question: "What is 'Type Coercion'?", options: ["A. An error", "B. The implicit conversion of values from one data type to another by the engine", "C. Writing types in TypeScript", "D. Deleting types"], answer: "B", explanation: "Example: 1 + '2' = '12' because the number is coerced into a string." },
    { id: 523, topic: "Logical", difficulty: "hard", question: "What is 'Bitwise AND' (5 & 1)?", options: ["A. 5", "B. 1", "C. 0", "D. 6"], answer: "B", explanation: "5 (101) & 1 (001) = 001, which is 1." },
    { id: 524, topic: "Logical", difficulty: "hard", question: "Which data structure is best for 'Undo' navigation?", options: ["A. Queue", "B. Stack", "C. Set", "D. Map"], answer: "B", explanation: "A stack (LIFO) allows you to push history and pop it to return to the previous state." },
    { id: 525, topic: "Logical", difficulty: "hard", question: "What is 'Deadlock'?", options: ["A. A crashed browser", "B. Two processes waiting for each other to release a resource, causing a freeze", "C. A secure password", "D. A closed connection"], answer: "B", explanation: "Deadlock is a common concurrency issue where no progress can be made." }
  ]
};

const RESOURCES = [
  {
    category: "JavaScript",
    color: "#f0c040",
    items: [
      { name: "javascript.info", url: "https://javascript.info", desc: "Best JS reference, covers everything from basics to advanced" },
      { name: "quiz.typeofnan.dev", url: "https://quiz.typeofnan.dev", desc: "Tricky JS output MCQs — exactly what GQ tests" },
      { name: "You Don't Know JS (free)", url: "https://github.com/getify/You-Dont-Know-JS", desc: "Deep dive into closures, scope, async — free on GitHub" },
    ]
  },
  {
    category: "React",
    color: "#61dafb",
    items: [
      { name: "react.dev", url: "https://react.dev", desc: "Official docs — hooks section is essential reading" },
      { name: "bigfrontend.dev", url: "https://bigfrontend.dev", desc: "React & JS coding challenges, very GQ-style" },
      { name: "TotalTypeScript React", url: "https://www.totaltypescript.com/tutorials/react-with-typescript", desc: "React patterns explained clearly, free tutorials" },
    ]
  },
  {
    category: "CSS & HTML",
    color: "#34d399",
    items: [
      { name: "css-tricks.com/flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox", desc: "The flexbox guide everyone bookmarks" },
      { name: "css-tricks.com/grid", url: "https://css-tricks.com/snippets/css/complete-guide-grid", desc: "Complete CSS Grid reference" },
      { name: "frontendquiz.com", url: "https://frontendquiz.com", desc: "HTML/CSS/JS multiple choice quiz practice" },
    ]
  },
];

const TOPIC_COLOR = {
  JavaScript: "#f0c040",
  React: "#61dafb",
  HTML: "#e96228",
  CSS: "#3b82f6",
  Logical: "#a78bfa",
};

const DIFF_COLOR = { easy: "#34d399", medium: "#f0c040", hard: "#f87171" };

// ── COMPONENT ───────────────────────────────────────────────────────────────
export default function InterviewPrep() {
  const [tab, setTab] = useState("quiz"); 
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExp, setShowExp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("intro");
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const startQuiz = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Tiny delay to simulate "Generation" feel
    await new Promise(r => setTimeout(r, 600));

    try {
      let pool = [];
      if (topic === "All") {
        // Build 15 questions based on original distribution requirements
        pool = [
          ...MASTER_QUESTIONS.JavaScript.slice(0, 4),
          ...MASTER_QUESTIONS.React.slice(0, 3),
          ...MASTER_QUESTIONS.HTML.slice(0, 3),
          ...MASTER_QUESTIONS.CSS.slice(0, 3),
          ...MASTER_QUESTIONS.Logical.slice(0, 2),
        ];
      } else {
        // Get all from one topic
        pool = MASTER_QUESTIONS[topic] || [];
      }

      // Filter by difficulty if needed
      if (difficulty !== "All") {
        pool = pool.filter(q => q.difficulty === difficulty.toLowerCase());
      }

      // Final shuffle and trim to 15
      const final = pool.sort(() => Math.random() - 0.5).slice(0, 15);
      
      if (final.length === 0) {
        throw new Error("No questions found for this combination.");
      }

      setQuestions(final);
      setPhase("quiz");
      setCurrent(0);
      setAnswers([]);
      setSelected(null);
      setShowExp(false);
    } catch (e) {
      setError(e.message || "Failed to load.");
    }
    setLoading(false);
  }, [topic, difficulty]);

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    setShowExp(true);
    setAnswers(prev => [...prev, {
      id: questions[current].id,
      selected: opt[0], // Extract "A", "B", etc
      correct: questions[current].answer,
      topic: questions[current].topic,
    }]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) setPhase("results");
    else { setCurrent(c => c + 1); setSelected(null); setShowExp(false); }
  };

  const score = answers.filter(a => a.selected === a.correct).length;
  const q = questions[current];
  const missedByTopic = answers.filter(a => a.selected !== a.correct).reduce((acc, a) => {
    acc[a.topic] = (acc[a.topic] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{
      minHeight: "100vh", background: "#080810", color: "#d4d4d8",
      fontFamily: "monospace", paddingBottom: 48,
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #18181b", padding: "16px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, background: "#080810", zIndex: 10,
      }}>
        <div>
          <span style={{ color: "#f0c040", fontWeight: 700 }}>GQ</span>
          <span style={{ color: "#3f3f46" }}> PREP</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["quiz", "resources"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? "#18181b" : "transparent",
              border: `1px solid ${tab === t ? "#3f3f46" : "transparent"}`,
              color: tab === t ? "#e4e4e7" : "#52525b",
              padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontSize: 11,
              textTransform: "uppercase",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px" }}>
        {tab === "quiz" && (
          <>
            {phase === "intro" && (
              <div>
                <div style={{ marginBottom: 40 }}>
                  <h1 style={{ color: "#fafafa", fontSize: 32 }}>15 Questions.<br /><span style={{ color: "#f0c040" }}>Hard Mode.</span></h1>
                  <p style={{ color: "#71717a", fontSize: 13 }}>Genuinely difficult frontend engineering test.</p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 10, color: "#3f3f46", marginBottom: 8 }}>TOPIC</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["All", "JavaScript", "React", "HTML", "CSS", "Logical"].map(t => (
                      <button key={t} onClick={() => setTopic(t)} style={{
                        padding: "6px 14px", borderRadius: 4,
                        border: `1px solid ${topic === t ? (TOPIC_COLOR[t] || "#f0c040") : "#27272a"}`,
                        background: "transparent",
                        color: topic === t ? (TOPIC_COLOR[t] || "#f0c040") : "#52525b",
                        cursor: "pointer", fontSize: 11,
                      }}>{t}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 36 }}>
                  <div style={{ fontSize: 10, color: "#3f3f46", marginBottom: 8 }}>DIFFICULTY</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["All", "easy", "medium", "hard"].map(d => (
                      <button key={d} onClick={() => setDifficulty(d)} style={{
                        padding: "6px 14px", borderRadius: 4,
                        border: `1px solid ${difficulty === d ? (DIFF_COLOR[d] || "#f0c040") : "#27272a"}`,
                        background: "transparent",
                        color: difficulty === d ? (DIFF_COLOR[d] || "#f0c040") : "#52525b",
                        cursor: "pointer", fontSize: 11, textTransform: "capitalize",
                      }}>{d}</button>
                    ))}
                  </div>
                </div>

                {error && <div style={{ color: "#f87171", marginBottom: 16, fontSize: 12 }}>{error}</div>}

                <button onClick={startQuiz} disabled={loading} style={{
                  background: "#f0c040", color: "#080810", border: "none",
                  padding: "14px 36px", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", borderRadius: 4, width: "100%",
                }}>
                  {loading ? "GENERATING..." : "START TEST →"}
                </button>
              </div>
            )}

            {phase === "quiz" && q && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 10 }}>
                  <span style={{ color: "#52525b" }}>{current + 1} / {questions.length}</span>
                  <span style={{ color: TOPIC_COLOR[q.topic] }}>{q.topic.toUpperCase()}</span>
                </div>
                
                <div style={{ height: 2, background: "#18181b", marginBottom: 28 }}>
                  <div style={{
                    height: "100%", background: "#f0c040",
                    width: `${((current + 1) / questions.length) * 100}%`,
                    transition: "width 0.3s",
                  }} />
                </div>

                <div style={{
                  background: "#0f0f17", border: "1px solid #1c1c27",
                  borderRadius: 8, padding: 24, marginBottom: 16,
                }}>
                  <pre style={{ margin: 0, fontSize: 14, whiteSpace: "pre-wrap", color: "#e4e4e7", lineHeight: 1.6 }}>{q.question}</pre>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {q.options.map((opt) => {
                    const letter = opt[0];
                    const isCorrect = letter === q.answer;
                    const isSelected = selected === opt;
                    let bg = "#0f0f17", border = "#1c1c27", color = "#a1a1aa";
                    
                    if (selected) {
                      if (isCorrect) { bg = "rgba(52,211,153,0.08)"; border = "#34d399"; color = "#34d399"; }
                      else if (isSelected) { bg = "rgba(248,113,113,0.08)"; border = "#f87171"; color = "#f87171"; }
                    }

                    return (
                      <button key={opt} onClick={() => handleSelect(opt)} style={{
                        background: bg, border: `1px solid ${border}`, borderRadius: 6,
                        padding: "14px 18px", textAlign: "left", cursor: selected ? "default" : "pointer",
                        color, fontSize: 13, transition: "0.2s", fontFamily: "inherit"
                      }}>{opt}</button>
                    );
                  })}
                </div>

                {showExp && (
                  <div style={{
                    background: "#0a0a12", border: "1px solid #1c1c27", borderRadius: 6,
                    padding: 16, marginBottom: 16, fontSize: 12, color: "#71717a", lineHeight: 1.6
                  }}>
                    <strong style={{ color: "#f0c040" }}>INSIGHT:</strong> {q.explanation}
                  </div>
                )}

                {selected && (
                  <button onClick={handleNext} style={{
                    background: "#f0c040", color: "#080810", border: "none",
                    padding: "14px", fontSize: 11, fontWeight: 700,
                    cursor: "pointer", borderRadius: 4, width: "100%", textTransform: "uppercase"
                  }}>
                    {current + 1 >= questions.length ? "VIEW RESULTS" : "NEXT QUESTION →"}
                  </button>
                )}
              </div>
            )}

            {phase === "results" && (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 10, color: "#52525b", marginBottom: 8 }}>FINAL SCORE</div>
                  <div style={{ fontSize: 64, fontWeight: 900, color: score >= 10 ? "#34d399" : "#f0c040" }}>
                    {score}<span style={{ fontSize: 24, color: "#3f3f46" }}>/ {questions.length}</span>
                  </div>
                </div>

                {Object.keys(missedByTopic).length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 10, color: "#3f3f46", marginBottom: 12 }}>WEAK AREAS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {Object.entries(missedByTopic).map(([t, count]) => (
                        <div key={t} style={{
                          padding: "6px 12px", borderRadius: 4, border: `1px solid ${TOPIC_COLOR[t]}`,
                          color: TOPIC_COLOR[t], fontSize: 11
                        }}>{t}: {count} missed</div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setPhase("intro")} style={{
                    background: "#f0c040", color: "#080810", border: "none",
                    padding: "12px 24px", borderRadius: 4, cursor: "pointer", fontWeight: 700
                  }}>RETRY</button>
                  <button onClick={() => setTab("resources")} style={{
                    background: "transparent", color: "#d4d4d8", border: "1px solid #27272a",
                    padding: "12px 24px", borderRadius: 4, cursor: "pointer"
                  }}>STUDY RESOURCES</button>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "resources" && (
          <div>
            <h2 style={{ color: "#fafafa", marginBottom: 24 }}>Curated Study Guide</h2>
            {RESOURCES.map(section => (
              <div key={section.category} style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 10, color: section.color, marginBottom: 12, borderBottom: `1px solid ${section.color}33`, paddingBottom: 4 }}>
                  {section.category.toUpperCase()}
                </div>
                {section.items.map(item => (
                  <a key={item.name} href={item.url} target="_blank" rel="noreferrer" style={{
                    display: "block", background: "#0f0f17", padding: 16, borderRadius: 8,
                    marginBottom: 8, textDecoration: "none", border: "1px solid #1c1c27"
                  }}>
                    <div style={{ color: "#e4e4e7", fontSize: 14, fontWeight: 600 }}>{item.name} ↗</div>
                    <div style={{ color: "#52525b", fontSize: 12, marginTop: 4 }}>{item.desc}</div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}