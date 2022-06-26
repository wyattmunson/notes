# Coding Challenges

Katas

## Counter button with useState

Create a counter button that increments state by 1. Display current count.

## Implement a countdown timer

## Implement a search bar

```js
const people = [
  { name: "Greg Benish", age: 25 },
  { name: "Daniel Benish", age: 23 },
  { name: "Daniel Benson", age: 29 },
];
```

Given the following array, create a search bar that displays matching names.

## To Do list

Implement a todo list.

- Input field for user to add items
- Use `text-direction: line-through;` CSS to mark completed items
- Count open tasks
- Uncheck completed items

## Phone Book

Create a phonebook.

```
[   { name: "Greg Benish", phone: 456-789-5484 },
    { name: "Larry Gaga", phone: 214-707-5084 }   ]
```

- Create an app that displays phonebook data
- Make a mock API call to get data async'ly.
- Display results in asthetically pleasing way

Bonuses

- Add form (name and phone inputs) to add more entries to the phone book
- Allow users to be deleted from the list

## Basic Ecomm Site

- Display list of products and minicart on the same page
- Users can select products and add to mini cart
- Users can change quantity or remove products from minicart

## Move search page

Implement a quick webapp

- Search for a movie based on input text
- Fire API call
-

Handle dealer config.

Thesis: Dealer's `public-api-key` dictates all integration configurations.

- Each row in the dealer table will represent a RAPID ID and thus an integration type (long vs short, modal, approval first, ect.),
- Current flags (like modal) are a hodgepodge of data of metadata from the consumer (this is unnecessary and problematic if they don't supply it)

Proposal: add one `configuration` jsonb column in the dealers table.

- Stored in central place for easy reference and updating
- These are one time configs that are manually created at dealer onboarding and manually updated (until developer portal is created).

```js
{
  integrationType: "approvalFirst",
  flowType: "modal",
  appType: "short",
  dealerName: "The Couch Crew",
  dealerLogoUrl: "example.com/logo.png",

  // other configs as needed
  returnSuccessUrl: "example.com/magento/trigger-success",
};
```
