# React Interview: React Knowledge Questions

- [Explain ReactJS](#Explain-ReactJS)
- [Advantages of React ](#Advantages-of-React)
- [Disadvantages of React ](#Disadvantages-of-React)
- [Explain JSX](#Explain-JSX)
- [Controlled vs. uncontrolled components](#Controlled-vs-uncontrolledcomponents)
- [Unit vs. Integration Tests](Unit-vs-Integration-Tests)
- [Implement a custom hook](#Implement-a-custom-hook)
- [Context API and Re-rendering](#Context-API-and-Re-rendering)
- [HOCs](#HOCs)
- [Render Props](#Render-Props)
- [HOCs vs. Render Props](#HOCs-vs-Render-Props)
- [The Flux Pattern](#The-Flux-Pattern)
- [Redux](#redux)
- [When to use Refs](#When-to-use-Refs)
- [What are Pure Components](#What-are-Pure-Components)
- [How are events handled in React](#How-are-events-handled-in-React)
- [Is setState() async](#Is-setState-async)
- [What is Redux Thunk for](#What-is-Redux-Thunk-for)
- [Explain dependencies and devDependencies in NPM](#Explain-dependencies-and-devDependencies-in-NPM)
- [Finding a Performance Bottleneck in Chrome DevTools](#Finding-a-Performance-Bottleneck-in-Chrome-DevTools)

## Explain ReactJS

React is a JavaScript UI framework developed by Facebook to create fast, interactive, and reusable web and mobile apps. It delivers the presentation layer (in MVC it's just the V). Can be combined with a state management tool like Redux to provide the M and C.

## Advantages of React

- Steller developer ecosystem: abundant resources, guides, stack overflow posts
- Good developer tools: React and Redux browser extensions
- React's virtual DOM reduces DOM updates and increases efficiency
- JSX (HTML/XML monster) makes it easy to write HTML in JavaScript

## Disadvantages of React

- Sometimes heavy handed for the use case
- If you need the M and C, it can take a while before implementing a solution
-

## Explain JSX

- An XML/HTML-like syntax used in React to write HTML in JavaScript
- Preferred way to build UIs in React
- Actually a syntax extension to ECMAScript

## Controlled vs. uncontrolled components

- Controlled components are controlled by React through SyntheticEvent methods.
- They handle cross-browser differences, but can differ from the browser's native events.
- Controlled input recieves current value as prop and callback to change said value. It's the React Way. It's consistent across browsers.

**Uncontrolled input** stores its state internally via the DOM API.

No `value` or `onChange` here. Rather, `ref()`.

```js
<input type="text" ref={this.textInput} />;

// access input data
this.textInput.current.value;
```

## Unit vs. Integration Tests

Respect the testing pyramid.

- UI tests, E2E
- Integration tests
- Unit tests

Unit tests should comprise a bulk of the work. They are the cheapest and are easily automated in the pipeline.

As you go up the pyramid, tests become more complex, more expensive, slower to complete, and harder to automate.

For React, a good option for **integration tests** is **React Testing Library**. Tests as a user would interact with the app: what you can see. The API returns HTML elements instead of Enzyme's React components with shallow rendering.

For **unit tests**, **Enzyme** is still a good option, much more sophisticated API allowing you to manipulate the component's props and internal state.

## Implement a custom hook.

Be able to create a custom hook and show it's usage too.

## Context API and Re-rendering

Unlike Redux, Context does maintain its own state. Just reading state between components.

Easy to have many unnecessary re-renders with Context API, even with `PureComponent` or `React.Memo`.

## HOCs

> A HOC is a function that takes a component and returns a new component.

Used to share code between React components. E.g., pass Button component to a Black Border HOC.

```js
const Button = (props) => <button {...props}>Hello</button>;

const withBackBorder = (Component) => (props) => (
  <Component {...props} style={{ border: "1px solid black" }} />
);

const BlackButton = withBlackBorder(Button);
```

## Render Props

> When a component takes a function that returns a React element and calls it instead of implementing its own render logic.

You've probably used this with React Router.

### HOCs vs Render Props

## The Flux Pattern

Three major parts: dispatcher, store, and view.

Not a framework or library, but architecture promoting unidirectional data flow.

Actions get dispatched to the store. The store is updated and UI renders based on the new state. Actions can be dispatched from UI, but not all.

- Not to be confused with MVC. Controllers exist, but as controller-views.
- Chooses unidirectional data flow over MVC
- Single dispatcher hub in Flux app. Registry of callbacks, no real intelligence.

## Redux

![Image](images/reduxDiagram.gif)

**General Concepts**:

- All state updates are done immutably -
- Uses the one-way data flow - state describes app at a point in time, UI renders based on that state. UI can dispatch an action or other state change updates store and UI renders based on new state.
- Use when "lifting state up" doesn't cut it
-

Overview:

- **Action** - plain JS object with event and possibly a payload. Actions get dispatched. They explain "what happened?"
- **Reducer** - a function that calculates new state based oncurrent state and an action object, then returns the new state.
- **Dispatch** - only way to update state is to call `dispatch()` and pass in an action object.
- **Store** - the Redux store in the state value of an application. Store runs root reducer whenever an action is dispatched.

**Action** - plain JS object with event and possibly a payload.

Should always have a `type` field. Can optionall carry more data, called `payload` by convention.

Action object:

```js
const addTodoAction = {
  type: "todo/addTodo",
  payload: "Get milk",
};
```

Action creator is a function that returns an action object.

**Reducer** - a function that recieves current state and an action object, then returns the new state

Reducer:

- Receive current state and action object
- Calculate new state, returns new state
- Updates are immutable, copy existing state and change copy
- No async logic, calculate random values, or other "side effects"

Similar to event listeners who handle events based on the received action.

**Dispatch** - only way to update state is to call `dispatch()` and pass in an action object.

Dispatching actions is like "trigger an event" in the application.

Something happened, we want to know about it. Reducers act like listeners and update the state when the hear an action they're interested in.

**Store** - the Redux store in the state value of an application (a big ol' object).

Store is created by passing in a reducer.

## When to use Refs

- When you need to manage focus, select text, or media playback
- Trigger imperative animations
- Integrate with third-party DOM libraries

## What are Pure Components

Lightweight and simple components that only return a `render()`. Beneficial for comprehension and performance.

## Whare are Pure Functions

> Pure fuctions return values solely based on their argument. Same input will always generate same output.

## How are events handled in React

React event handlers are passed to instance of `SyntheticEvent` - React's cross-browser wrapper for event handling.

React doesn't attach events to the child nodes themselves, rather it uses a single event listner to listen to all events at the top level. Great for performance and doesn't need to keep tracks of event listeners when updating the DOM.

## Is setState() async

Yes.

React does not guarantee sync calls to setState. Calls to setState may be batched for performance reasons.

## What is Redux Thunk for

Allows us to handle the async dispatching of actions.

Action creators that return a function instead of an action. Can also delay dispatch of action until certain consition is met.

## Explain dependencies and devDependencies in NPM

- `dependencies` are required to run (axios, moment.js, redux)
- `devDependencies` are required for development (jest, webpack, babel, eslint)

## Finding a Performance Bottleneck in Chrome DevTools

- Replicate when UI is working slowly
- Open developer tools and click Profiler
- Start recording
- Find longest, yellow bar - that's taking the longest time to render, start there.

## Explain Functional Programming

- Coding using pure functions, app data flows through pure functions
- Declarative rather than imperative
- Avoid changing state, mutating data, and producing side effects

In functional code, the ouput of a function relies solely on its input.

## My Questions

```js
const classes = [
  { class: "Math", student: "Greg", teacher: "Johnson", grade: 90, credits: 3 },
  {
    class: "History",
    student: "Greg",
    teacher: "Burns",
    grade: 81,
    credits: 4,
  },
  {
    class: "Geography",
    student: "Greg",
    teacher: "Burns",
    grade: 72,
    credits: 3,
  },
  {
    class: "English",
    student: "Greg",
    teacher: "Marshall",
    grade: 96,
    credits: 3,
  },
];

// { class: "Math", student: "Greg", teacher: "Johnson", grade: 90, credits: 3},
// { class: "History", student: "Greg", teacher: "Burns", grade: 81, credits: 4},
// { class: "Geography", student: "Greg", teacher: "Burns", grade: 72, credits: 3},
// { class: "English", student: "Greg", teacher: "Marshall", grade: 96, credits: 3},

// Return the class where the techer is Johnson
// output: "Math"

// Return the records where Burns is the teacher
// output:
//      { class: "History", student: "Greg", teacher: "Burns", grade: 81, credits: 4},
//      { class: "Geography", student: "Greg", teacher: "Burns", grade: 72, credits: 3},

// Sum the number of credits
// output: 13

// Return weighted average of all courses
// output ~84.4

/**
 * React questions
 */

// Have you ever created custom hooks
// Would you ever use multiple useEffects
// Logic reuse between components - fetching different data sources, displaying different data, but share creating and removing an event listener
//

/**
 *
 */

//
// Do you perfer direction and order, or freedom and openendedness

// (90*3)+(81*4)+(72*3)+(96*3)
```
