# usefiltex

![npm](https://img.shields.io/npm/v/usefiltex)

This library is built around two simple pieces: the `useFilter()` hook and the `filter()` function.

`useFilter()` is the core of the library. It lets you declaratively filter an array of objects in React. You provide a list of objects and a list of filters — the hook handles the rest.

The `filter()` function is a helper to define your filtering rules in a clean and reusable way.

## 💡 Idea

This library was created to solve a common problem when working with lists in React: filtering objects in a clean, declarative way.

The core concept is to **separate the definition of filters from their execution**. First, you declare the filters you want to use, then you apply them to your list, and finally you activate them to actually trigger the filtering.

### ⚡ Apply vs Activate

So, what’s the difference between apply and activate?

- **Apply** — tells your code how you want to filter a list. It sets up the filter logic but doesn’t modify the list yet.

- **Activate** — actually runs the filtering, applying the active filters to the list.

This approach gives you flexibility: You can apply multiple filters ahead of time and then activate them all at once, or you can apply and activate them one by one, all in a fully declarative and predictable way.

> _💡 This pattern is super handy when you want your filters to be controlled by UI elements (like checkboxes, dropdowns, or toggles) and avoid hardcoding filter logic directly in your React components._

## How to Install

To install **usefiltex** just use:

```cli
npm install usefiltex
```

## Hook API

###

### `useFilter()`

```jsx
useFilter({
  list: <list_of_object_to_filter>,
  filters: <list_of_filters>
})
```

#### 🧾 Arguments

| Name      | Description                                                | Required |
| --------- | ---------------------------------------------------------- | -------- |
| `list`    | The array of objects you want to filter                    | ✅ Yes    |
| `filters` | An array of filters that will be used to filter the `list` | ✅ Yes    |

Example:

```jsx
useFilter({
  list: [
    { firstName: "John", lastName: "Doe", age: 28 },
    { firstName: "Alice", lastName: "Johnson", age: 22 },
    { firstName: "Bob", lastName: "Brown", age: 17 },
    { firstName: "Charlie", lastName: "Davis", age: 40 }
  ],
  filters: [
    filter("age", (person) => person.age > 25)
  ]
})
```

> **NOTE**: To declare a filter use the helper function `filter()`

> **NOTE**: The `filters` do not apply immediately to the given `list` but we have to apply and activate them with the `apply()` and `activate()` methods on the `manager`.

#### 🔁 Return Values

```jsx
const { filtered, manager, getFilter } = useFilter(...)
```

| Name        | Description                                                                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filtered`  | The filtered list, in sync with the the all the applied and activated filters.                                                                                  |
| `manager`   | An object to manage all the filters: apply them, remove them, toggle, and activate all.                                                                         |
| `getFilter` | A function to grab filters. You can get filters by name (e.g. `getFilter("filterName")`) or all the filters by passing `"all"` to it (e.g. `getFilter("all")`). |

> **NOTE**: The returned filtered list is exposed under the `filtered` key by default. This is intended as a **placeholder**, and it's recommended to _rename_ it to something meaningful for the context, e.g. `const { filtered: filteredBooks } = useFilter(...)

### `manager` API

The `manager` object handles all interactions with your filters.

It allows you to apply, remove, toggle, reset, and finally activate filters on your list.

### 🧠 `manager` Methods

| Method                         | Description                                                                                  | Returns               |
| ------------------------------ | -------------------------------------------------------------------------------------------- | --------------------- |
| `apply(filterName, payload?)`  | Marks a filter as active and stores an optional `payload`.                                   | `manager` (chainable) |
| `remove(filterName, payload?)` | Deactivates the specified filter and stores an optional `payload`.                           | `manager` (chainable) |
| `toggle(filterName, payload?)` | Toggles the active state of a filter. If it was active, it becomes inactive, and vice-versa. | `manager` (chainable) |
| `reset()`                      | Deactivates all filters and clears their active state.                                       | `manager` (chainable) |
| `activate()`                   | Applies all active filters to the list and updates the `filtered` result.                    | `void`                |


#### ⚠️ Notes

`apply()`, `remove()`, `toggle()` and `reset()` do not immediately filter the list — they only update the filter state.

You must call `activate()` to apply the current active filters and update the filtered result.

All methods (except `activate()`) return the `manager` itself, so you can chain calls.

### `filter()` Function

The `filter()` function is used to define filtering rules for `useFilter()`.
It returns a filter object containing:

|Property|Description|
|---|---|
|`name`|The identifier of the filter. Used to reference the filter when applying, removing or toggling it.|
|`filter`|A callback function that defines the filtering logic. It receives the current list item (and optionally a `payload` if passed) and must return `true` to include the item in the filtered list.|

#### Example

```jsx
const myFilter = filter("minAge", (person, minAge) => person.age >= minAge);
```

In this example:

- `name` is `"minAge"`.
- The filtering logic keeps only the people whose age is greater than or equal to `minAge`.
- `payload` is expected to be a number (`minAge`) when applying the filter.

## Examples - Filtering Books

For the following examples we'll use a list of books:

```jsx
const books = [
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy", year: 1997 },
  { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", year: 1937 },
  { title: "1984", author: "George Orwell", genre: "Dystopian", year: 1949 },
  { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", year: 1960 },
  { title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-fiction", year: 2011 }
];
```

Let's create also a component to display the list of books:

```jsx
function FilteredBooks({ books }) {
  return (
    <div>
      {books.map((book) => (
        <div key={book.title}>
          <h2>{book.title} - {book.year}</h2>
          <p>{book.author}</p>
          <p>{book.genre}</p>
        </div>
      ))}
    </div>
  )  
}
```

### Single Filter

Let's imagine we want to obtain all the books published _after the year 2000_:

```jsx
import { useFilter, filter } from 'usefiltex';

function Books() {

  const { filtered: filteredBooks, manager } = useFilter({
    // list to filter
    list: books,
    filters: [
      // declare our filters
      filter("year", (book) => book.year > 2000)
    ]
  })
  
  function filter() {
    manager
      .apply("year")  // apply the 'year' filter
      .activate()     // activate all the applied filters
  }

  return (
    <div>
      <FilteredBooks books={filteredBooks}>
      <button onClick={filter}>Filter</button>
    </div>
  )
}
```

When the user clicks on the _Filter_ button, the declared `"year"` filter will be applied and immediately activated, showing only _Sapiens - by Yuval Noah Harari_.

### Multiple Filters

Let's imagine we want to obtain all the _fantasy books_ published _after the year 1990_:

```jsx
import { useFilter, filter } from 'usefiltex';

function Books() {

  const { filtered: filteredBooks, manager } = useFilter({
    // list to filter
    list: books,
    filters: [
      // declare our filters
      filter("fantasy", (book) => book.genre === "Fantasy"),
      filter("year", (book) => book.year > 1990),
    ]
  })
  
  function filter() {
    manager
      .apply("fantasy") // apply the 'fantasy' filter
      .apply("year")    // apply the 'year' filter
      .activate()       // activate all the applied filters
  }

  return (
    <div>
      <FilteredBooks books={filteredBooks}>
      <button onClick={filter}>Filter</button>
    </div>
  )
}
```

### Apply Before and Activate After

Let's imagine we want our user to be able to apply different filters depending on its needs and activate all of them all at once:

```jsx
import { useFilter, filter } from 'usefiltex';

function Books() {

  const { filtered: filteredBooks, manager } = useFilter({
    // list to filter
    list: books,
    filters: [
      // declare our filters
      filter("fantasy", (book) => book.genre === "Fantasy"),
      filter("year", (book) => book.year > 1990),
    ]
  })
  
  function applyFantasyFilter() {
    manager.apply("fantasy") // apply the 'fantasy' filter
  }

  function applyYearFilter() {
    manager.apply("year") // apply the 'year' filter
  }
  
  function activateFilter() {
    manager
      .activate() // activte all the applied filters
  }

  return (
    <div>
      <FilteredBooks books={filteredBooks}>
      <button onClick={applyFantasyFilter}>Fantasy</button>
      <button onClick={applyYearFilter}>Year</button>
      <button onClick={activateFilter}>Filter</button>
    </div>
  )
}
```

### Applied Filters Feedback

If we want to let our user to know which filters are applied whenever they want, we can use the returned `getFilter()` function returned by `useFilter()`.

In this way the user can use the status of the filter to toggle the style of a button:

```jsx
import { useFilter, filter } from 'usefiltex';

function Books() {

  const {
    filtered: filteredBooks,
    manager,
    getFilter
  } = useFilter({
    // list to filter
    list: books,
    filters: [
      // declare our filters
      filter("fantasy", (book) => book.genre === "Fantasy"),
    ]
  })
  
  function applyFilter() {
    manager.
      toggle("Fantasy") // toggle filter
  }
  
  function filter() {
    manager
      .activate() // activte all the applied filters
  }
  
  return (
    <div>
      <FilteredBooks books={filteredBooks}>
      <button
        style={getFilter("fantasy").isActive ? { background: "blue"} : {}}
        onClick={applyFilter}
      >Filter</button>
      <button onClick={filter}>Filter</button>
    </div>
  )
}
```

### Dynamic Filters

In this example, we’ll use `payload` to pass dynamic filter conditions — like filtering books by publication year range.

This shows how flexible your hook is when the filtering rules depend on user input (search bars, sliders, dropdowns, etc.).

```jsx
import { useFilter, filter } from 'usefiltex';

function Books() {
  const { filtered: filteredBooks, manager } = useFilter({
    list: books,
    filters: [
        filter("yearRange", (book, [minYear, maxYear]) => book.year >= minYear && book.year <= maxYear),
        filter("byAuthor", (book, searchTerm) => 
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ]
  });
  
  function filterByAuthor() {
    manager
      .apply("byAuthor", "Kyle")  // search for "Kyle" in the author name
  }
  
  function filterByYear() {
    manager
      .apply("yearRange", [2010, 2020])    // Year between 2010 and 2020
  }
  
  function filter() {
    manager
      .activate();
  }
  
  return (
    <div>
      <FilteredBooks books={filteredBooks}>
      <button onClick={filterByAuthor}>Author Filter</button>
      <button onClick={filterByYear}>Year Filter</button>
      <button onClick={filter}>Filter</button>
    </div>
  )
}
```

### 💬 Feedback

If you find a bug, have an idea for a feature, or just want to say hi — open an issue!  
I'd love to hear how you're using this library and how it can improve.

---

Thanks for checking out `usefiltex`!

HAPPY FILTERING! 🚀
