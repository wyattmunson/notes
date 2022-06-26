# React Interview: Code and Examples

Overview:

- [React Fundamentals I](#react-fundamentalsi)
  - [Attaching React to the DOM](#Attaching-React-to-the-DOM)
  - [Creating a timeout](#Creating-a-timeout)
  - [Resetting Form Fields](#Resetting-Form-Fields)
  - [Accessing previous state in useState](#Accessing-previous-state-in-useState)
- [React Fundamentals II](#react-fundamentals-ii)
  - [List and Keys](#list-and-keys)
- [Hooks](#hooks)
  - [useState](#usestate)
  - [useEffect](#useeffect)
    - useEffect to Fire Async call
    - Use Effect Paramaterized Async API Call
    - Return a Cleanup Function
  - [Custom Hook: Data fetch](#DIY-Hooks-Data-Fetch)
  - [Custom Hook: Data fetch enhanced](#DIY-Hooks-Data-Fetch-Enhancecd)
  - [Lifecyle Method to Hook Conversion](#Lifecyle-Method-to-Conversion)
- [Forms and Hooks](#Forms-and-Hooks)
- [Array Helpers](#array-helpers)
  - [Find](#find)
  - [Filter](#filter)
  - [Reduce](#reduce)
- [Simple Search](#Simple-Search-with-Hooks)

## React Fundamentals I

### Attaching React to the DOM

```js
ReactDOM.render(<App />, document.getElementById("app"));
```

### Creating a timeout

The simplest timeout:

```js
setTimeout(() => {
  console.log("Waited 3 secs");
}, 3000);
```

Timeout inside useEffect:

```js
useEffect(() => {
  const timer = setTimeout(() => {
    // do something on finish
  }, 3000);
}, []);
```

Timeout to simulate async API call:

```js
// mock async call
// function that returns a promise
const apiMockResponse = () => {
  const responseData = [1, 2, 3];

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(responseData), 2000);
  });
};
```

### Resetting Form Fields

Will reset form input field. Can clear form fields after submit button clicked. Wrap input fields in `<form>` that fires the handler onSubmit.

```js
const handleSubmit = (e) => {
  e.target.reset();
};
```

### Accessing previous state in useState

```js
const handleSubmit = (e) => addTodo((prevTodo) => [...prevTodo, newText]);
```

## React Fundamentals II

### Lists and Keys

React uses Keys to identify which elements have changed, added, or removed. Apply keys to the elements inside arays.

- Use a unique value, must be a string
- `.map()` takes `index` as second argument, use as last resort
- The `key` should be assigned in the parent element rendered in the `.map()` function, not accessed as a prop in the child component.
- Index is bad if you going to remove children, as the key will change and reduce React's effectiveness

```js
const someArray = [1, 2, 3];

const listItems = someArray.map((number) => {
  <li key={number.toString()}>{number}</li>;
});
```

## Hooks

- [useState](#usestate)
- [useEffect](#useeffect)
  - useEffect to Fire Async call
  - Use Effect Paramaterized Async API Call
  - Return a Cleanup Function
- [Custom Hook: Data fetch](#DIY-Hooks-Data-Fetch)
- [Custom Hook: Data fetch enhanced](#DIY-Hooks-Data-Fetch-Enhancecd)
- [Lifecyle Method to Hook Conversion](#Lifecyle-Method-to-Conversion)

### useState()

```js
// useState basic structure
const [count, setCount] = useState(0);
```

#### **useState Counter Example**

```js
import React, { useState } from "react";

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

#### **Accessing previous state**

Can pass function to `setState` that accepts previous state as argument and returns new state.

```js
const [counter, setCounter] = useState(0);

<button onClick={() => setCounter(prevCount => prevCount + 1)}>
```

### useEffect()

**useEffect to Fire Async call**

```js
const [data, seData] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fireApiCall = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://url.com");
      const responseData = await res.json();
    } catch (err) {
      setError("API Call failed");
    }
    setIsLoading(false);
  };
  fireApiCall();
}, [data]);
// Pass `[]` as second argument to prevent rerenders
```

**Use Effect Paramaterized Async API Call**

```js
const { query } = props;
const [data, setData] = useState({ hits: [] });

useEffect(() => {
  const fetchData = async () => {
    const result = await axios("https://.com/" + query);

    setData(result.data);
  };

  fetchData();
}, [query]);
// Pass `[query]` as second argument, to fire another API call when query changes
```

#### **useEffect to Fire Async call with fetch promises**

```js
const [data, seData] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const response = async () => {
    setLoading(true);

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        setData(res);
      })
      .catch((error) => {
        setError(true);
      });
    setLoading(false);
  };
  response();
}, [data]);
// Pass `[]` as second argument to prevent rerenders
```

**Return a Cleanup Function**

Return a function for any cleanup logic

```js
useEffect(() => {
  const sub = props.source.subscribe();
  // cleanup function
  return () => {
    sub.unsubscribe();
  };
}, [props.source]);
```

### Custom Hooks: Data Fetch

Takes in a URL and returns result.

**Create custom hook called `useFetch()`**:

```js
export const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const result = await fetch(url);
        const json = await result.json();
        setData(json);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [url]);

  return [data, loading];
};
```

**Consume above `useFetch()` custom hook**:

```js
const [data, loading, error] = useFetch("http://someapi.com/users");

// all variables accessable
if (error) return <h1>Error loading page</h1>
if (loading) return <h1>Loading</h1>
if (data.length > 0) return {data.map((i) => ...)}
```

### DIY Hooks: Data Fetch Enhancecd

```js
// hooks.js
export const useDataFetch = (initialUrl, initialData) => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);
        setData(result.data);
      } catch (e) {
        setError(e);
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return [{ data, isLoading, isError, error, url }, setUrl];
};
```

### Hooks in 3rd Party Libraries

React Redux supports the `useDispatch()` and `useSelector()` hooks.

React-router-dom supports: `useHistory()`, `useLocation()`, `useParams()`, `useRouteMatch()`. See [full list](https://reactrouter.com/web/api/Hooks).

### Lifecyle Method to Hook Conversion

- `constructor`: Function components don’t need a constructor. You can initialize the state in the useState call. If computing the initial state is expensive, you can pass a function to useState.
- `getDerivedStateFromProps`: Schedule an update while rendering instead.
- `shouldComponentUpdate`: See React.memo below.
- `render`: This is the function component body itself.
- `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: The `useEffect` Hook can express all combinations of these (including less common cases).
- `getSnapshotBeforeUpdate`, `componentDidCatch` and `getDerivedStateFromError`: There are no Hook equivalents for these methods yet, but they will be added soon.

### Omiting List of Dependencies

## Random

### Error Boundaries

Must use class components, no hook equivalent exists yet.

## Dark Mode

### Dark Mode with SASS and Class Names

```js
const makeDark = () => {
  console.log("HIT");
  if (darkMode) {
    document.body.classList.remove("dark-mode");
  } else {
    document.body.classList.add("dark-mode");
  }
  setDarkMode(!darkMode);
};
```

## Forms and Hooks

Let's take a look at some forms and some hooks.

Should be able to stand up a workable form without any libraries.

```js
//
const [formInputs, setFormInputs] = useState();

const handleFormSubmit = (e) => {
  e.preventDefault();
  console.log(formInputs);
};

// single handler for all inputs
const handleFormInput = useCallback(
  ({ target }) =>
    setFormInputs((state) => ({ ...state, [target.name]: target.value })),
  []
);

return (
  <form onSubmit={submitHandler}>
    <input name="firstName" type="text" onChange={handleFormInput} />
    <input name="lastName" type="text" />
    <input name="cellPhone" type="tel" />
  </form>
);
```

## Array Helpers

### Find

Find the first matching element in an array.

```js
const array = [
  { class: "English", score: 3 },
  { class: "Spanish", score: 5 },
];

const spanish = array.find((x) => x.class === "Spanish");
```

### Filter

```js
const array = [
  { class: "English", score: 3 },
  { class: "Spanish", score: 5 },
  { class: "History", score: 5 },
];

const highScore = array.filter((x) => x.score === 5);
```

### Reduce

```js
const array = [
  { class: "English", score: 3 },
  { class: "Spanish", score: 5 },
  { class: "History", score: 5 },
];

const totalScores = array.reduce((total, curr) => {
  return (total += curr.score);
}, 0);
```

## Controlled Components

When a React component renders a form and also controls what the form does on user input.

- Form data is handled by React.
- Use event handlers to update state

## Uncontrolled Components

- Form data is handled by the DOM itself
- Use `refs` to access form values from the DOM

```js
<input type="text" className="dark-mode" ref={nameInput} />
```

## React Router Dom

```js
import { BrowserRouter, Switch, Route } from "react-router-dom";

<BrowserRouter>
  <Switch>
    <Route exact path="/" component={HomePage} />
  </Switch>
</BrowserRouter>;
```

## Setup

### Attaching React to the DOM

Attach React to HTML `id`.

```html
<div id="app"></div>
```

```js
React.render(<Application some={thing} />, document.getElementById("app"));
```

## API Calls

```js
fetch(url)
  .then((res) => res.json())
  .then((res) => saveData(res))
  .catch((err) => setError(err));
```

```js
const fetchData = async () => {
  try {
    const result = await fetch(url);
    const json = await result.json();
    setData(json);
  } catch (err) {
    setError(true);
  }
  setLoading(false);
};
```

```js
const parentFn = async () => {
  const asyncData = await fetch();
};

// Await keyword
async function hello() {
  return (greeting = await Promise.resolve("Hello"));
}

hello().then(alert);
```

### Reworking the Classic Fetch

Replacing promise code with aync/await.

Fetch-based promises (Old Reliable):

```js
// Fetch-based promises (Old Reliable):

fetch("url.com")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Bad requests");
    }
    return res.json();
  })
  .then((res) => {
    // so some stuff
  })
  .catch((e) => {
    console.log("Encountered error:", e);
  });
```

Fetch with async/await:

```js
// Alternative with async/await:

async function myFetch() {
  let response = await fetch("http;//com");

  if (!response.ok) {
    throw new Error("Response returned error:", response.status);
  }

  // do some stuff
}

myFetch().catch((e) => {
  console.log("Failed to fetch: ", e);
});
```

See [more at MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await).

## Simple Search with Hooks

Implementing search in a component. Utilizes `useState`, `useEffect`, and the JS `includes()` function.

```js
// details = [ { name: "Greg B"}, ... ]

const PhonebookContainer = ({ details }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const matches = details.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(matches);
  }, [searchTerm]);

  return (
    <>
      <input type="text" onChange={handleChange} />
      {results.map((item) => (
        <p>
          {item.name} - {item.phoneNumber}
        </p>
      ))}
    </>
  );
};
```

### Crash Course on Includes

The `includes()` helper matches any string whose search letters are touching.

```js
"ben".includes(""); // => true
"ben".includes("en"); // => true
"ben".includes("bn"); // => false
```

## List of React Challenges

- [West Spring Challenge Advanced React](https://github.com/LambdaSchool/web-sprint-challenge-advanced-react)
