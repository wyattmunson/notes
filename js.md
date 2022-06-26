# JS

## Topics to Learn

### ES6

ES6, or ES6 compatible, javascript is considered modern javascript. ES6 is a specification of JavaScipt that defines the syntax that is considered valid javascript.

```js
// old function syntax
function convertToCelcius(temp) {
  return (temp - 32) / 1.8;
}

// ES6 "fat arrow" syntax
const convertToCelcius = (temp) => {
  return (temp - 32) / 1.8;
};
```

ES6 introduces a way to

### The basics

- Declaring variables
  - When to use `let` and `const`
  - Don't use `var` - this is an older syntax and can lead to "scope" issues
- Data Types
- Defining and calling functions
  - Know what a return value is and how to use it
  - Know how to declare a function, understand the different types of function declarations
- Flow control (`if` statements)
  - Know the parts of an if statement `if`, `if else`, `else`
- Loops
  - Understan
- Throwing and catching errors

### Declaring Variables

```js
// declare a variable that cannot change
const speedLimit = 60;

// declare a variable that can change
let currentSpeed = 45;

// currentSpeed can be changed
currentSpeed = 35;
currentSpeed = currentSpeed + 10;

// constants cannot be reassigned
speedLimit = 70; // ⚠️ this will throw a TypeError
speedLimit = speedLimit + 10; // ⚠️ this will throw a TypeError
```

Variables can be scoped, meaning they can be seen (at not seen) at various levels in the code.

```js
let printValue;

doubleNumber(7);

function doubleNumber(numb) {
  // declare new variable in function
  let result = numb * 2;
  // set previously declared variable to `result`
  // `printValue` was defined at the global scope and can be read inside this function
  printValue = result;

  // `result` can be accessed inside this function
  console.log(result); // returns 14
}

// `printValue` is set at the same scope and be read here
console.log(printValue); // returns: 14
// `result` only exists in the function scope and cannot be read here
console.log(result); // returns: undefined
```

### Javascript data types

```js
// "primitive" data types
const aString = "hello";
const aNumber = 1;
const aBoolean = true; // can be 'true', 'false', or 'null'

// more advnaced data types
const anArray = ["apple", 1, true];
console.log(anArray);
// ["apple", 1, true]
console.log(anArray[0]);
// "apple"
console.log(anArray[1]);
// 1
console.log(anArray[2]);
// true

// objects
const anObject = {
  size: "large",
  color: "green",
  inStock: true,
};
console.log(anObject.size);
// "large"

// an array of objects
const shirtList = [
  {
    size: "large",
    color: "green",
    inStock: true,
  },
  {
    size: "medium",
    color: "blue",
    inStock: false,
  },
];
console.log(shirtList[0].inStock);
// true
```

Mutable data types: In JavsScript, arrays and objects are mutable.

```js
let firstArray = [1, 2, 3];
let secondArray = firstArray;

// remove last element with JavaScript builtin pop
firstArray.pop();

console.log(firstArray);
// [1, 2]
console.log(secondArray);
// [1, 2]

/**
 * when creating `secondArray` JS merely saved a reference to `firstArray`
 * when `firstArray` changed, `secondArray` did too.
 * Use destructuring assignment of ES6 to make a clone of the array
 */

let thirdArray = [1, 2, 3];
let fourthArray = [...thirdArray];

// remove last element with JavaScript builtin pop
thirdArray.pop();

console.log(thirdArray);
// [1, 2]
console.log(fourthArray);
// [1, 2, 3]

/**
 * Save the output of pop
 */

// pop element of array and save to variable
let fifthArray = [1, 2, 3];
let lastValue = fifthArray.pop();
console.log(fifthArray);
// [1, 2]
console.log(lastValue);
// 3

/**
 * More array functions
 * pop - remove from the end
 * push - append to the end
 * shift - remove first element
 * unshift - append to the beginning
 */

let sixthArray = [1, 2, 3];
sixthArray.pop();
// [1, 2]
sixthArray.push(4);
// [1, 2, 4]
sixthArray.shift();
// [2, 4]
sixthArray.unshift(5);
// [5, 2, 4]

// Remember, the order of arrays are important

// count array length
console.log(sixthArray.length());
// 3
```

### Functions

```js
// declaring a function
function somFunction(text) {
  console.log(test);
}

// calling a function
someFunction("Hello world");
```

Functions will normally `return` a value.

```js
function doubleNumber(int) {
  return int * 2;
}

// set variable equal to function result.
let myNumber = doubleNumber(3);
console.log(myNumber); // should print '6';
```

## Code Snippets

Get last element after given character.

```js
const name = link.split("/").pop();

// Get last three elements of array
const path = link.split("/").slice(Math.max(link.legnth - 3, 0));
```

```js
/**
 *
 */
```
