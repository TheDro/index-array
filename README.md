# index-array
An array of objects that is automatically indexed when you search it.

## How to use
Create an IndexArray just as you would using the Array's formal constructor. Then use the `fetch` method to search the array.
```js
import IndexArray from 'index-array'

let array = new IndexArray({id: 1, name: 'one'}, {id: 3, name: 'three'})
array.fetch({id: 1}) // {id: 1, name: 'one'}
array.fetch({name: 'one'}) // {id: 1, name: 'one'}
```

Whenever you call the `fetch` method, an index is automatically created for the key you searched so that subsequent searches are faster. You can use `fetchIndex` instead if you want to get the position of your search result in the array.
```js
array.fetchIndex({id: 1}) // 0
array.fetchIndex({name: 'three'}) // 1
```

### Additional features
All of the objects in the `IndexArray` are wrapped in proxies which will detect changes and keep the index updated so that you don't need to worry about retrieving stale results.
```js
let array = new IndexArray({id: 1, name: 'one'}, {id: 3, name: 'three'})
let firstResult = array.fetch({id: 1}) // {id: 1, name: 'one'}
firstResult.id = 2 // {id: 2, name: 'one'}
let secondResult = array.fetch({id: 2}) // {id: 2, name: 'one'}
```

### Supported methods
Currently, the following methods from Arrays are supported and will not break the indexing functionality:

- `push`
- `splice`

The following additional methods are also supported. See code examples below.

- `add` is the same as `push` but returns the original IndexArray which makes it chainable. 
- `replace` should be used to replace an element instead of other methods such as splice. It can be called with a search object or a number.
- `remove` should be used to remove an element instead of other methods such as splice. It can be called with a search object or a number.
- `clone` returns a shallow copy of the index array. It's useful in frameworks like React when you need to return a new array. It effectively replaces `array = [...array]`.

### Examples

```js
let array = new IndexArray({id: 1, name: 'one'})
array.add({id: 3, name: 'three'}).add({id: 5, name: 'five'}) // [{id: 1, name: 'one'}, {id: 3, name: 'three'}, {id: 5, name: 'five'}]
array.replace({id: 3}, {id: 4, name: 'four'}) // [{id: 1, name: 'one'}, {id: 4, name: 'four'}, {id: 5, name: 'five'}]
array.replace(2, {id: 6, name: 'six'}) // [{id: 1, name: 'one'}, {id: 4, name: 'four'}, {id: 6, name: 'six'}]
array.remove({id: 4}) // [{id: 1, name: 'one'}, {id: 6, name: 'six'}]
array.remove(0) // [{id: 6, name: 'six'}]
```


## License
Do whatever you want with it.
