import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  createContext,
  forwardRef,
} from 'react';

import './App.css'

// Create a context for demonstration
const ThemeContext = createContext('light');

// A custom hook example
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useDebugValue helps in debugging custom hooks in React DevTools
  useDebugValue(windowSize, (size) => `Window: ${size.width}x${size.height}`);

  return windowSize;
}

// Counter reducer for useReducer example
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error('Unknown action');
  }
}

// Child component that demonstrates useImperativeHandle
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    setValue: (value) => {
      inputRef.current.value = value;
    },
  }));

  return <input ref={inputRef} {...props} />;
});

function ReactHooksDemo() {
  // 1. useState - For managing simple state
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 2. useReducer - For more complex state logic
  const [counterState, dispatch] = useReducer(counterReducer, { count: 0 });

  // 3. useContext - For consuming context
  const theme = useContext(ThemeContext);

  // 4. useRef - For persisting values between renders without causing re-renders
  const renderCount = useRef(0);
  const inputRef = useRef();
  const fancyInputRef = useRef();

  // 5. useEffect - For side effects (runs after render)
  useEffect(() => {
    // This runs after every render
    console.log('Component rendered');

    // Cleanup function (optional) - runs before the next effect or unmount
    return () => {
      console.log('Cleanup before next render or unmount');
    };
  });

  useEffect(() => {
    // With empty dependency array, this only runs once after initial render
    console.log('Component mounted');

    // Cleanup function (optional) - runs on unmount
    return () => {
      console.log('Component unmounted');
    };
  }, []);

  useEffect(() => {
    // This runs only when count changes
    console.log(`Count is now: ${count}`);
    document.title = `You clicked ${count} times`;
  }, [count]);

  // 6. useLayoutEffect - Similar to useEffect but fires synchronously after DOM mutations
  useLayoutEffect(() => {
    // Use this for DOM measurements or mutations that need to be done before browser paint
    console.log('DOM measurements or mutations here');
  }, []);

  // 7. useCallback - Memoizes a callback function
  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // Empty array means this function is created once and never recreated

  // 8. useMemo - Memoizes a computed value
  const expensiveCalculation = useMemo(() => {
    console.log('Calculating...');
    // Imagine this is an expensive calculation
    let result = 0;
    for (let i = 0; i < 1000; i++) {
      result += i;
    }
    return result + count;
  }, [count]); // Only recalculate when count changes

  // 9. Custom hook usage
  const windowSize = useWindowSize();

  // Track render count
  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div
      style={{
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333',
      }}
			class="flex flex-col items-center gap-6 m-7 md:flex-row md:gap-8 rounded-2xl"
    >
      <h1>React Hooks Learning Guide</h1>

      <section>
        <h2>1. useState</h2>
        <p>Used for simple state management</p>
        <div>
          <button onClick={() => setCount(count + 1)}>Increment</button>
          <button onClick={() => setCount(count - 1)}>Decrement</button>
          <p>Count: {count}</p>
        </div>
        <div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Type something...'
          />
          <p>You typed: {text}</p>
        </div>
      </section>

      <section>
        <h2>2. useReducer</h2>
        <p>Used for complex state logic</p>
        <div>
          <button onClick={() => dispatch({ type: 'increment' })}>
            Increment
          </button>
          <button onClick={() => dispatch({ type: 'decrement' })}>
            Decrement
          </button>
          <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
          <p>Counter: {counterState.count}</p>
        </div>
      </section>

      <section>
        <h2>3. useContext</h2>
        <p>Current theme: {theme}</p>
      </section>

      <section>
        <h2>4. useRef</h2>
        <p>Component has rendered {renderCount.current} times</p>
        <input ref={inputRef} placeholder='Regular input' />
        <button onClick={() => inputRef.current.focus()}>Focus Input</button>
        <br />
        <FancyInput
          ref={fancyInputRef}
          placeholder='Fancy input with imperative handle'
        />
        <button onClick={() => fancyInputRef.current.focus()}>
          Focus Fancy Input
        </button>
        <button
          onClick={() => fancyInputRef.current.setValue('Hello from parent!')}
        >
          Set Fancy Input Value
        </button>
      </section>

      <section>
        <h2>5. useEffect</h2>
        <p>Check console to see useEffect logs</p>
        <p>Document title is now set to: "You clicked {count} times"</p>
      </section>

      <section>
        <h2>6. useLayoutEffect</h2>
        <p>Similar to useEffect but fires synchronously</p>
        <p>Check console to see useLayoutEffect logs</p>
      </section>

      <section>
        <h2>7. useCallback</h2>
        <p>Memoized callback - only created once</p>
        <button onClick={handleClick}>Memoized Increment</button>
      </section>

      <section>
        <h2>8. useMemo</h2>
        <p>
          Expensive calculation result (only recalculated when count changes):{' '}
          {expensiveCalculation}
        </p>
      </section>

      <section>
        <h2>9. Custom Hook: useWindowSize</h2>
        <p>Window width: {windowSize.width}px</p>
        <p>Window height: {windowSize.height}px</p>
        <p>Try resizing your browser window!</p>
      </section>

      <section>
        <h2>Additional Hooks</h2>
        <p>
          <strong>useImperativeHandle:</strong> Demonstrated with the FancyInput
          component above
        </p>
        <p>
          <strong>useDebugValue:</strong> Used in the useWindowSize custom hook
          (visible in React DevTools)
        </p>
      </section>
    </div>
  );
}

// Wrap the demo in a ThemeProvider
function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={theme}>
      <div>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle Theme ({theme})
        </button>
        <ReactHooksDemo />
      </div>
    </ThemeContext.Provider>
  );
}
export default App;
