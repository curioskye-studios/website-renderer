import { useState, useCallback } from "react";

const ALL_QUESTIONS = [
  { section: "JSX", q: "What is JSX?", options: ["A separate language that compiles to Python", "A syntax extension of JavaScript that allows HTML-like syntax in JS", "A CSS-in-JS library", "A JavaScript module bundler"], answer: 1, explanation: "JSX is a syntax extension of JavaScript that lets you write HTML-like syntax directly inside JavaScript files. It's compiled to regular JS by tools like Babel." },
  { section: "JSX", q: "How must single-tag HTML elements like <img> and <br> be written in JSX?", options: ["<img>", "<img/>", "<img />", "Either <img> or <img/>"], answer: 2, explanation: "Single-tag elements in JSX must be self-closed: <img /> or <br />. Plain <img> is invalid JSX." },
  { section: "React Element Attributes", q: "Why is `className` used instead of `class` in JSX?", options: ["React doesn't support the class attribute", "`class` is a reserved keyword in JavaScript", "className is faster to parse", "It's just a React convention with no technical reason"], answer: 1, explanation: "`class` is a reserved keyword in JavaScript used for creating classes. Since JSX is JavaScript, we use `className` to avoid the conflict." },
  { section: "React Element Attributes", q: "In JSX, attribute names follow which casing convention?", options: ["snake_case", "kebab-case", "camelCase", "PascalCase"], answer: 2, explanation: "JSX is JavaScript, so attribute names use camelCase — e.g., `onClick`, `className`, `tabIndex`." },
  { section: "React Elements Embedded JavaScript", q: "How do you embed a JavaScript expression inside JSX?", options: ["Using double quotes \"\"", "Using ${ }", "Using curly braces { }", "Using backticks ` `"], answer: 2, explanation: "Curly braces `{}` let you embed any JavaScript expression directly inside JSX — variables, function calls, ternaries, etc." },
  { section: "React Element Inline Styles", q: "How do you write inline styles in JSX?", options: ['style="color:blue"', "style={{ color: 'blue' }}", "style='color: blue'", "css={{ color: 'blue' }}"], answer: 1, explanation: "In JSX, `style` accepts a JavaScript object (not a string), so you write `style={{ color: 'blue' }}`. The outer `{}` embeds JS, the inner `{}` is the object literal." },
  { section: "React Element Inline Styles", q: "How would you write `text-align: center` as a JSX inline style property?", options: ["text-align: 'center'", "textAlign: 'center'", "'text-align': 'center'", "TextAlign: 'center'"], answer: 1, explanation: "CSS properties in JSX inline styles use camelCase. `text-align` becomes `textAlign`." },
  { section: "React Fragments", q: "What does a React Fragment render in the DOM?", options: ["A <div> wrapper", "A <span> wrapper", "Nothing — it doesn't appear in the DOM", "A comment node"], answer: 2, explanation: "Fragments are special React elements that let you group children without adding an extra DOM node." },
  { section: "React Fragments", q: "What is the shorthand syntax for React Fragments?", options: ["<React.Fragment>", "<Fragment>", "<>", "<group>"], answer: 2, explanation: "The shorthand `<>...</>` works as a Fragment without needing to import anything from React." },
  { section: "Functional Components", q: "What are the two rules all React components must follow?", options: ["Must use hooks and must export default", "Names must be capitalized and must return JSX", "Must have props and must have state", "Must be arrow functions and must use memo"], answer: 1, explanation: "All React components must: (1) have capitalized names, and (2) return JSX — specifically one parent-level JSX element." },
  { section: "Functional Components", q: "A functional component is essentially:", options: ["A class that extends Component", "A JavaScript function that returns JSX", "An HTML template with directives", "A state machine"], answer: 1, explanation: "Functional components are plain JavaScript functions (either function declarations or arrow functions) that return JSX." },
  { section: "Component Props", q: "What is a React prop?", options: ["Internal state of a component", "Custom data passed to a component via attributes", "A CSS class applied to a component", "A lifecycle method"], answer: 1, explanation: "Props are custom attributes you put on a component element to pass data into it. Inside the component, they're collected into a plain JavaScript object." },
  { section: "Component Props", q: "What does destructuring props do?", options: ["Spreads all props onto the element", "Pulls specific values out of the props object for cleaner code", "Creates a default prop", "Defines a state variable"], answer: 1, explanation: "Destructuring `({ title })` pulls `title` directly from the props object — a common shorthand for cleaner code instead of `props.title`." },
  { section: "The Children Prop", q: "What is the `children` prop?", options: ["An array of all props passed to a component", "Content placed between a component's opening and closing tags", "The component's default export", "A special hook for rendering lists"], answer: 1, explanation: "`children` is a built-in prop that contains whatever JSX is placed between a component's opening and closing tags." },
  { section: "Conditional Rendering", q: "What happens when a component returns `null`?", options: ["React throws an error", "The component renders an empty div", "Nothing is rendered to the DOM", "The component unmounts"], answer: 2, explanation: "Returning `null` from a component is valid and results in nothing being rendered to the DOM." },
  { section: "Conditional Rendering", q: "Which operator is commonly used for inline conditional rendering in JSX?", options: ["if/else", "switch", "Ternary operator ? :", "for"], answer: 2, explanation: "The ternary operator `condition ? <A /> : <B />` is the most common way to write conditional rendering inline within JSX." },
  { section: "Lists in Components", q: "Which array method is used to render lists of elements in React?", options: [".forEach()", ".filter()", ".map()", ".reduce()"], answer: 2, explanation: "`.map()` returns a new array of JSX elements from each item, which React can render. `.forEach()` returns undefined and won't work." },
  { section: "Lists in Components", q: "Why should you avoid using the array index as the `key` prop?", options: ["Indexes are strings, not numbers", "It causes syntax errors in JSX", "React may confuse elements when multiple maps have overlapping indexes", "Indexes are not accessible inside map callbacks"], answer: 2, explanation: "If multiple `.map()` calls exist, each starts indexing from 0. Overlapping index values can cause React to incorrectly identify which components to re-render." },
  { section: "Lists in Components", q: "What is the purpose of the `key` prop in lists?", options: ["It styles each list item uniquely", "It lets React identify which components have changed and need re-rendering", "It provides an accessible label for screen readers", "It acts as the component's internal state"], answer: 1, explanation: "React uses `key` to track which items have changed, been added, or removed in a list, optimizing re-rendering." },
  { section: "Memo", q: "What does `React.memo` do?", options: ["Memoizes a function's return value", "Prevents a component from re-rendering if its props haven't changed", "Stores data in a ref across renders", "Caches API responses"], answer: 1, explanation: "`React.memo` wraps a component and causes it to skip re-rendering when its parent re-renders, as long as the props haven't changed." },
  { section: "Memo", q: "What does the optional second argument to `React.memo` do?", options: ["Sets the initial props", "Provides a custom comparison function to decide if re-rendering should occur", "Enables deep prop comparison automatically", "Attaches a callback for when the component unmounts"], answer: 1, explanation: "The second argument is a custom `(prevProps, nextProps) => boolean` function. Return `true` to skip re-render, `false` to re-render." },
  { section: "Context", q: "What problem does React Context solve?", options: ["Managing async data fetching", "Prop drilling — passing data through many component layers unnecessarily", "Styling components globally", "Preventing unnecessary re-renders"], answer: 1, explanation: "Context lets you share data across the component tree without manually passing props through every intermediate component." },
  { section: "Context", q: "What two things does `createContext` return?", options: ["A useState and a useEffect", "A Provider component and a Consumer component", "A Context object and a hook", "A store and a dispatcher"], answer: 1, explanation: "`createContext` returns a context object with two components: `Provider` (wraps the tree and supplies the value) and `Consumer` (accesses the value in child components)." },
  { section: "useState", q: "What does `useState` return?", options: ["The current state value only", "A setter function only", "An array with the current state value and a setter function", "An object with `value` and `set` properties"], answer: 2, explanation: "`useState` returns `[stateValue, setterFunction]`. It's conventional to destructure this: `const [count, setCount] = useState(0)`." },
  { section: "useState", q: "What triggers a component re-render when using `useState`?", options: ["Directly mutating the state variable", "Calling the setter function with a new value", "Reading the state value in JSX", "Importing useState"], answer: 1, explanation: "Only calling the setter function (e.g. `setCount(newValue)`) triggers a re-render. Direct mutation does not." },
  { section: "useState", q: "The setter function from `useState` is:", options: ["Synchronous", "Asynchronous", "Synchronous for primitives, async for objects", "Synchronous only inside event handlers"], answer: 1, explanation: "The setter is asynchronous — if you log state immediately after calling the setter, you may see the old value." },
  { section: "useEffect", q: "When does `useEffect` run with an empty dependency array `[]`?", options: ["On every render", "Only once, when the component mounts", "Only when the component unmounts", "Never"], answer: 1, explanation: "An empty dependency array means the effect runs once after the initial mount and never again." },
  { section: "useEffect", q: "How do you run cleanup code when a component unmounts using `useEffect`?", options: ["Pass a second useEffect with no dependencies", "Use componentWillUnmount inside useEffect", "Return a cleanup function from the effect function", "Call useEffect with null as the dependency array"], answer: 2, explanation: "Returning a function from inside the effect function registers it as cleanup. React calls it when the component unmounts." },
  { section: "useEffect", q: "Why does useEffect run *after* React renders the component?", options: ["To access the DOM before painting", "To ensure the effect doesn't block browser painting", "Because it's scheduled in a microtask", "For backward compatibility with class components"], answer: 1, explanation: "useEffect deliberately runs after rendering to avoid blocking the browser from painting, keeping the UI responsive." },
  { section: "useLayoutEffect", q: "What is the key difference between `useLayoutEffect` and `useEffect`?", options: ["useLayoutEffect only works in class components", "useLayoutEffect runs synchronously after DOM mutations but before the browser paints", "useLayoutEffect has no dependency array", "useLayoutEffect cannot return a cleanup function"], answer: 1, explanation: "`useLayoutEffect` fires synchronously after DOM mutations but before the browser paints, useful for avoiding screen flickers." },
  { section: "useRef", q: "What is the shape of the object returned by `useRef`?", options: ["{ value: initialValue }", "{ current: initialValue }", "{ ref: initialValue }", "initialValue directly"], answer: 1, explanation: "`useRef` returns `{ current: initialValue }`. You access and mutate the stored value via `.current`." },
  { section: "useRef", q: "How does `useRef` differ from `useState`?", options: ["useRef cannot store DOM nodes", "Mutating a ref's `.current` does NOT trigger a re-render", "useRef requires an initial value", "useRef values reset on every render"], answer: 1, explanation: "Unlike `useState`, updating `ref.current` does not cause a re-render. The value persists but changes are invisible to React's rendering cycle." },
  { section: "useCallback", q: "What problem does `useCallback` solve?", options: ["Prevents expensive computations from running on every render", "Prevents functions from being needlessly recreated on every render", "Prevents components from re-rendering when state changes", "Caches API responses between renders"], answer: 1, explanation: "`useCallback` memoizes a function reference so it isn't recreated on every render." },
  { section: "useCallback", q: "When does `useCallback` recreate the memoized function?", options: ["Every render", "When the component unmounts", "When a value in the dependency array changes", "When the component's parent re-renders"], answer: 2, explanation: "The function is only recreated when one of the values listed in the dependency array changes." },
  { section: "useMemo", q: "What is memoization?", options: ["Storing component state in memory", "Caching the result of an expensive function and reusing it for the same inputs", "Preventing a component from mounting twice", "Serializing component props to localStorage"], answer: 1, explanation: "Memoization caches the return value of a function call. On subsequent calls with the same inputs, the cached result is returned instead of recomputing." },
  { section: "useMemo", q: "What does `useMemo` memoize compared to `useCallback`?", options: ["useMemo memoizes a function; useCallback memoizes its return value", "useMemo memoizes a return value; useCallback memoizes a function reference", "They memoize the same thing", "useMemo memoizes components; useCallback memoizes hooks"], answer: 1, explanation: "`useMemo` memoizes the *return value* of a function. `useCallback` memoizes the *function itself*." },
  { section: "useContext", q: "What is the advantage of `useContext` over the `Context.Consumer` component?", options: ["useContext works without a Provider", "useContext allows cleaner, more readable access to context without render prop boilerplate", "useContext enables multiple contexts simultaneously", "useContext automatically updates the context value"], answer: 1, explanation: "`useContext` lets you access a context value with a simple hook call instead of the `<Consumer>{value => ...}</Consumer>` render prop pattern." },
  { section: "Class Component", q: "In a class component, where does the JSX get returned from?", options: ["The constructor", "The render() method", "The componentDidMount() method", "The state setter"], answer: 1, explanation: "Class components must have a `render()` method that returns JSX." },
  { section: "Class Component", q: "How do you access props and state inside a class component?", options: ["As function parameters", "Via the `this` keyword (this.props, this.state)", "Through the useState hook", "Via destructured arguments in render()"], answer: 1, explanation: "In class components, `this.props` and `this.state` are used to access props and state respectively." },
  { section: "Constructor", q: "What is the `constructor` in a class component primarily used for?", options: ["Fetching data on mount", "Declaring initial state and binding methods", "Defining the render output", "Setting up subscriptions"], answer: 1, explanation: "The constructor runs before the component mounts and is used to initialize `this.state` and bind custom methods." },
  { section: "State (Class Components)", q: "How do you update state in a class component?", options: ["this.state.count = 1", "this.setState({ count: 1 })", "this.updateState({ count: 1 })", "setState(count, 1)"], answer: 1, explanation: "You must use `this.setState()` — never directly mutate `this.state`. React performs a shallow merge of the new state." },
  { section: "State (Class Components)", q: "What does the optional second argument to `setState` do?", options: ["Sets the initial state", "Runs a callback after state has been updated", "Prevents the component from re-rendering", "Deep-merges the state object"], answer: 1, explanation: "The second argument `setState(nextState, callback)` runs after the state update has been applied and the component has re-rendered." },
  { section: "componentDidMount", q: "When does `componentDidMount` run?", options: ["Before the component renders for the first time", "After the component is mounted to the DOM", "Every time the component re-renders", "When the component unmounts"], answer: 1, explanation: "`componentDidMount` runs once, after React has mounted the component into the DOM." },
  { section: "componentWillUnmount", q: "What is `componentWillUnmount` used for?", options: ["Re-fetching data when props change", "Cleanup tasks before the component is removed", "Initializing component state", "Triggering a final re-render"], answer: 1, explanation: "`componentWillUnmount` is called just before a component is removed from the DOM. Used for cleanup like unsubscribing from APIs." },
  { section: "componentDidUpdate", q: "What arguments does `componentDidUpdate` receive?", options: ["newProps and newState", "prevProps and prevState", "error and info", "nextProps and nextState"], answer: 1, explanation: "`componentDidUpdate(prevProps, prevState)` receives previous props and state so you can compare them to current values." },
  { section: "componentDidUpdate", q: "When does `componentDidUpdate` NOT run?", options: ["When props change", "When state changes", "On the initial render", "When a child component updates"], answer: 2, explanation: "`componentDidUpdate` only runs after updates — it is skipped on the initial render. That's what `componentDidMount` is for." },
  { section: "Error Boundaries", q: "What is an Error Boundary?", options: ["A try/catch block inside a component", "A class component that catches errors in its child tree and shows fallback UI", "A React hook for handling async errors", "A special prop for error handling"], answer: 1, explanation: "Error Boundaries are class components with special lifecycle methods that catch errors anywhere in their child component tree." },
  { section: "getDerivedStateFromError", q: "During which phase is `getDerivedStateFromError` called?", options: ["Commit phase", "Render phase", "Unmount phase", "Mount phase"], answer: 1, explanation: "`getDerivedStateFromError` is called during the render phase. Side effects like logging are NOT allowed here." },
  { section: "componentDidCatch", q: "What are the two parameters `componentDidCatch` receives?", options: ["prevProps and prevState", "error and info (about the rendering issue)", "state and dispatcher", "component and stackTrace"], answer: 1, explanation: "`componentDidCatch(error, info)` receives the thrown error and component stack info. Commonly used to log errors to an external service." },
  { section: "componentDidCatch", q: "Why is `componentDidCatch` better suited for logging than `getDerivedStateFromError`?", options: ["It receives more error details", "It runs during the commit phase where side effects are allowed", "It runs before the render phase", "It can update state directly"], answer: 1, explanation: "`componentDidCatch` runs during the commit phase where side effects (like API calls) are permitted." },
  { section: "Hooks", q: "When were hooks introduced in React?", options: ["React 15.0", "React 16.3", "React 16.8", "React 17.0"], answer: 2, explanation: "Hooks were introduced in React 16.8, enabling functional components to use state and lifecycle features." },
  { section: "Hooks", q: "Where should hooks normally be called inside a component?", options: ["Inside event handlers", "Inside conditionals", "At the top of the component, before any conditionals", "Inside nested functions"], answer: 2, explanation: "Hooks must be called at the top level of a component — not inside loops, conditions, or nested functions." },
  { section: "Hooks", q: "What are the three phases of a React component's lifecycle?", options: ["Init, Update, Destroy", "Mounting, Updating, Unmounting", "Loading, Rendering, Painted", "Created, Active, Expired"], answer: 1, explanation: "The three phases are: Mounting (component created), Updating (re-renders from prop/state changes), Unmounting (removed from DOM)." },
];

const SECTIONS = [...new Set(ALL_QUESTIONS.map((q) => q.section))];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LIGHT = {
  bg: "#ffffff",
  surface: "#f8f8f8",
  border: "#e2e2e2",
  borderHover: "#c0c0c0",
  text: "#111111",
  textSecondary: "#666666",
  textMuted: "#aaaaaa",
  tagActiveBg: "#111111",
  tagActiveText: "#ffffff",
  optLetter: "#e8e8e8",
  optLetterText: "#555555",
  correctBg: "#dcfce7",
  correctBorder: "#86efac",
  correctText: "#166534",
  wrongBg: "#fee2e2",
  wrongBorder: "#fca5a5",
  wrongText: "#991b1b",
  feedbackGoodBg: "#f0fdf4",
  feedbackGoodBorder: "#22c55e",
  feedbackGoodText: "#166534",
  feedbackBadBg: "#fef2f2",
  feedbackBadBorder: "#ef4444",
  feedbackBadText: "#991b1b",
  progress: "#22c55e",
  btnBg: "#111111",
  btnText: "#ffffff",
  toggleBg: "#f0f0f0",
  toggleText: "#555555",
};

const DARK = {
  bg: "#0f0f0f",
  surface: "#1a1a1a",
  border: "#2a2a2a",
  borderHover: "#3a3a3a",
  text: "#f0f0f0",
  textSecondary: "#999999",
  textMuted: "#555555",
  tagActiveBg: "#f0f0f0",
  tagActiveText: "#0f0f0f",
  optLetter: "#242424",
  optLetterText: "#888888",
  correctBg: "#052e16",
  correctBorder: "#166534",
  correctText: "#4ade80",
  wrongBg: "#2d0a0a",
  wrongBorder: "#991b1b",
  wrongText: "#f87171",
  feedbackGoodBg: "#031a0e",
  feedbackGoodBorder: "#16a34a",
  feedbackGoodText: "#86efac",
  feedbackBadBg: "#1c0606",
  feedbackBadBorder: "#dc2626",
  feedbackBadText: "#fca5a5",
  progress: "#22c55e",
  btnBg: "#f0f0f0",
  btnText: "#0f0f0f",
  toggleBg: "#1e1e1e",
  toggleText: "#aaaaaa",
};

export default function ReactQuiz() {
  const [dark, setDark] = useState(true);
  const [activeSections, setActiveSections] = useState(new Set(SECTIONS));
  const [questions, setQuestions] = useState(() => shuffle(ALL_QUESTIONS));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);

  const t = dark ? DARK : LIGHT;

  const filtered = questions.filter((q) => activeSections.has(q.section));
  const q = filtered[current];
  const answered = selected !== null;
  const progress = filtered.length ? Math.round((current / filtered.length) * 100) : 0;

  const restart = useCallback(() => {
    setQuestions(shuffle(ALL_QUESTIONS));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setTotal(0);
    setDone(false);
  }, []);

  const toggleSection = (s) => {
    const next = new Set(activeSections);
    if (next.has(s)) next.delete(s);
    else next.add(s);
    setActiveSections(next);
    restart();
  };

  const choose = (idx) => {
    if (answered) return;
    setSelected(idx);
    setTotal((t) => t + 1);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= filtered.length) setDone(true);
    else { setCurrent((c) => c + 1); setSelected(null); }
  };

  const pct = total ? Math.round((score / total) * 100) : 0;

  const pageWrapper = {
    backgroundColor: t.bg,
    minHeight: "100vh",
    width: "100%",
    transition: "background 0.2s ease",
  };

  const shell = {
    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    maxWidth: 700,
    margin: "0 auto",
    padding: "2rem 1.25rem",
    color: t.text,
    transition: "color 0.2s",
  };

  return (
    <div style={pageWrapper}>
      <div style={shell}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: t.text, margin: 0 }}>React Quiz</h1>
          <button
            onClick={() => setDark((d) => !d)}
            style={{ background: t.toggleBg, border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: t.toggleText, cursor: "pointer" }}
          >
            {dark ? "☀ Light" : "☾ Dark"}
          </button>
        </div>

        {/* Section filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" }}>
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSection(s)}
              style={{
                fontSize: 11, padding: "4px 10px", borderRadius: 20,
                border: `1px solid ${activeSections.has(s) ? "transparent" : t.border}`,
                background: activeSections.has(s) ? t.tagActiveBg : t.surface,
                color: activeSections.has(s) ? t.tagActiveText : t.textSecondary,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {s}
            </button>
          ))}
          <button onClick={() => { setActiveSections(new Set(SECTIONS)); restart(); }} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, border: `1px solid ${t.border}`, background: t.surface, color: t.textSecondary, cursor: "pointer" }}>All</button>
          <button onClick={() => { setActiveSections(new Set()); restart(); }} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, border: `1px solid ${t.border}`, background: t.surface, color: t.textSecondary, cursor: "pointer" }}>None</button>
        </div>

        {filtered.length === 0 && (
          <p style={{ color: t.textSecondary, fontSize: 14 }}>Select at least one section to begin.</p>
        )}

        {filtered.length > 0 && !done && q && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: t.textSecondary }}>Score: {score}/{total}</span>
              <span style={{ fontSize: 13, color: t.textMuted }}>{current + 1} / {filtered.length}</span>
            </div>
            <div style={{ height: 3, background: t.surface, borderRadius: 2, marginBottom: "1.5rem" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: t.progress, borderRadius: 2, transition: "width 0.3s" }} />
            </div>

            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: t.textMuted, marginBottom: 8 }}>{q.section}</p>
            <p style={{ fontSize: 17, lineHeight: 1.65, marginBottom: "1.25rem", fontWeight: 500, color: t.text }}>{q.q}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1rem" }}>
              {q.options.map((opt, i) => {
                let extra = {};
                if (answered) {
                  if (i === q.answer) extra = { background: t.correctBg, borderColor: t.correctBorder, color: t.correctText };
                  else if (i === selected) extra = { background: t.wrongBg, borderColor: t.wrongBorder, color: t.wrongText };
                  else extra = { opacity: 0.4 };
                }
                return (
                  <button
                    key={i}
                    disabled={answered}
                    onClick={() => choose(i)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                      background: t.surface, border: `1px solid ${t.border}`,
                      borderRadius: 10, padding: "11px 14px", fontSize: 14,
                      color: t.text, cursor: answered ? "default" : "pointer",
                      transition: "all 0.15s", ...extra,
                    }}
                  >
                    <span style={{
                      width: 24, height: 24, borderRadius: "50%", background: t.optLetter,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 600, flexShrink: 0, color: t.optLetterText,
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div style={{
                fontSize: 14, lineHeight: 1.65, padding: "12px 14px", borderRadius: 10, marginBottom: "1rem",
                borderLeft: `3px solid ${selected === q.answer ? t.feedbackGoodBorder : t.feedbackBadBorder}`,
                background: selected === q.answer ? t.feedbackGoodBg : t.feedbackBadBg,
                color: selected === q.answer ? t.feedbackGoodText : t.feedbackBadText,
              }}>
                {selected === q.answer ? "✓ Correct. " : "✗ Incorrect. "}{q.explanation}
              </div>
            )}

            {answered && (
              <button
                onClick={next}
                style={{ padding: "10px 22px", background: t.btnBg, color: t.btnText, border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500 }}
              >
                {current + 1 >= filtered.length ? "See results →" : "Next question →"}
              </button>
            )}
          </>
        )}

        {done && (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ fontSize: 52, fontWeight: 700, color: t.text }}>{score}/{total}</div>
            <div style={{ fontSize: 20, color: t.textSecondary, marginBottom: 8 }}>{pct}%</div>
            <p style={{ fontSize: 16, color: t.textSecondary, marginBottom: "1.5rem" }}>
              {pct >= 90 ? "Excellent work!" : pct >= 70 ? "Good job!" : pct >= 50 ? "Keep practicing!" : "Review the cheatsheet and try again!"}
            </p>
            <button onClick={restart} style={{ padding: "10px 22px", background: t.btnBg, color: t.btnText, border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
              Restart quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}