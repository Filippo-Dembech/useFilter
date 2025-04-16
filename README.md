# `usefiltex`

This library is composed of two elements: `useFilter()` hook and the `filter()` function.

`useFilter()` hook is the core of the library. With it you can filter an array of objects. How? You just have to provide a list of objects to the hook and a list of filters to apply to those objects. The `filter()` function helps you create filters.

## How to Install

To install **usefiltex** just use:

```cli
npm install usefiltex
```

## Simple Example

Let's imagine we have a list of books:

```jsx
const books = [
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy", year: 1997 },
  { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", year: 1937 },
  { title: "1984", author: "George Orwell", genre: "Dystopian", year: 1949 },
  { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", year: 1960 },
  { title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-fiction", year: 2011 }
];
```

And we want to filter these books depending on the publishing year when the user clicks on a button:

```jsx
import { useFilter, filter } from 'usefiltex';

function Books() {

  const { _: filteredBooks, manager } = useFilter({
    list: books,
    filters: [
      filter("year", (book) => book.year > 2000)
    ]
  })

  return (
    <div>
      {filteredBooks.map((book) => (
        <div key={book.title}>
          <h2>{book.title} - {book.year}</h2>
          <p>{book.author}</p>
          <p>{book.genre}</p>
        </div>
      ))}
      <button onClick={() => manager.apply("year").activate()}>Filter</button>
    </div>
  )
}
```

### Explain the Example

`useFilter()` accepts an object.
