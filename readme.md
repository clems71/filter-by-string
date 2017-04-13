# filter-by-string

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Simple example

```js
const filterByString = require('filter-by-string')

const collection = [
  { id: 123, title: 'wash dishes', draft: false },
  { id: 124, title: 'wash house', draft: true },
  { id: 125, title: 'clean whiteboard', draft: false }
]

const result = filterByString('draft is false and title is wash*', collection)

// result is [{ id: 123, title: 'wash dishes', draft: false }]
```
