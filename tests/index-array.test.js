import IndexArray from '../index.js'
import {beforeEach, describe, test} from '@jest/globals'

describe('constructor', () =>{

  test('IndexArray behaves like an array', () => {
    let normalArray = new Array({id: 1}, {id: 3})
    let indexArray = new IndexArray({id: 1}, {id: 3})

    expect(normalArray.length).toEqual(indexArray.length)
    expect(normalArray[0]).toEqual(indexArray[0])
    expect(normalArray[1]).toEqual(indexArray[1])
    expect(normalArray[0].id).toEqual(indexArray[0].id)
    expect(normalArray[1].id).toEqual(indexArray[1].id)
  })

  test('it can clone an IndexArray', () => {
    let origArray = new IndexArray({id: 1}, {id: 3})
    let dupArray = new IndexArray(origArray)

    expect(origArray[0]).toEqual(dupArray[0])
    expect(origArray[1]).toEqual(dupArray[1])
  })

  test('it starts with no indexes', () => {
    let array = new IndexArray({id: 1}, {id: 3})

    expect(array.indexes).toEqual({})
  })

})


describe('fetch', () => {
  let firstObject, secondObject, array

  beforeEach(() => {
    firstObject = {id: 1, name: 'one'}
    secondObject = {id: 3, name: 'three'}
    array = new IndexArray(firstObject, secondObject)
  })

  test('it retrieves an object by key', () => {
    expect(array.fetch({id: 1})).toEqual(firstObject)
    expect(array.fetch({id: 3})).toEqual(secondObject)
  })

  test('it retrieves an identical object', () => {
    expect(array.fetch(array[0])).toBe(array[0])
  })

  test('it generates an index for the fetched key', () => {
    array.fetch({id: 1})

    expect(Object.keys(array.indexes)).toEqual(['id'])
    expect(array.indexes).toEqual({id: {1: 0, 3: 1}})
  })

  test('it generates an index for all fetched keys', () => {
    array.fetch({id: 1})
    array.fetch({name: 'one'})

    expect(Object.keys(array.indexes).sort()).toEqual(['id', 'name'])
    expect(array.indexes).toEqual({id: {1: 0, 3: 1}, name: {one: 0, three: 1}})
  })
})


describe('fetchIndex', () => {
  let firstObject, secondObject, array

  beforeEach(() => {
    firstObject = {id: 1, name: 'one'}
    secondObject = {id: 3, name: 'three'}
    array = new IndexArray(firstObject, secondObject)
  })

  test('it retrieves an object by key', () => {
    expect(array.fetchIndex({id: 1})).toEqual(0)
    expect(array.fetchIndex({id: 3})).toEqual(1)
  })

  test('it generates an index for all fetched keys', () => {
    array.fetchIndex({id: 1})
    array.fetchIndex({name: 'one'})

    expect(Object.keys(array.indexes).sort()).toEqual(['id', 'name'])
    expect(array.indexes).toEqual({id: {1: 0, 3: 1}, name: {one: 0, three: 1}})
  })
})


describe('replace', () => {
  let firstObject, secondObject, thirdObject, array

  beforeEach(() => {
    firstObject = {id: 1, name: 'one'}
    secondObject = {id: 3, name: 'three'}
    thirdObject = {id: 5, name: 'five'}
    array = new IndexArray(firstObject, secondObject, thirdObject)
  })

  test('replaces an object by key', () => {
    array.fetch({id: 1})
    let newObject = {id: 6, name: 'six'}
    array.replace({id: 3}, newObject)

    expect(array.length).toEqual(3)
    expect(array[0]).toEqual(firstObject)
    expect(array[1]).toEqual(newObject)
    expect(array[2]).toEqual(thirdObject)
    expect(array.indexes).toEqual({id: {1: 0, 6: 1, 5: 2}})
  })

  test('replaces an object by index', () => {
    array.fetch({id: 1})
    let newObject = {id: 6, name: 'six'}
    array.replace(1, newObject)

    expect(array.length).toEqual(3)
    expect(array[0]).toEqual(firstObject)
    expect(array[1]).toEqual(newObject)
    expect(array[2]).toEqual(thirdObject)
    expect(array.indexes).toEqual({id: {1: 0, 6: 1, 5: 2}})
  })

  test('does nothing if key cannot be found', () => {
    array.fetch({id: 1})
    array.replace({id: 10}, {id: 0, name: 'zero'})

    expect(array.length).toEqual(3)
    expect(array[0]).toEqual(firstObject)
    expect(array[1]).toEqual(secondObject)
    expect(array[2]).toEqual(thirdObject)
    expect(array.indexes).toEqual({id: {1: 0, 3: 1, 5: 2}})
  })
})

describe('push', () => {
  test('appends object to indexed array', () => {
    let array = new IndexArray({id: 1}, {id: 3})
    array.fetch({id: 1})
    let newObject = {id: 5}
    array.push(newObject)

    expect(array.length).toEqual(3)
    expect(array[2]).toEqual(newObject)
    expect(array.indexes).toEqual({id: {1: 0, 3: 1, 5: 2}})
  })
})

describe('add', () => {
  test('acts as a chainable push method', () => {
    let array = new IndexArray({id: 1})
    array.fetch({id: 1})
    let secondObject = {id: 3}
    let thirdObject = {id: 5}
    array.add(secondObject).add(thirdObject)

    expect(array.length).toEqual(3)
    expect(array[1]).toEqual(secondObject)
    expect(array[2]).toEqual(thirdObject)
    expect(array.indexes).toEqual({id: {1: 0, 3: 1, 5: 2}})
  })
})

describe('remove', () => {
  test('removes an object from indexed array by key', () => {
    let firstObject = {id: 1, name: 'one'}
    let secondObject = {id: 3, name: 'three'}
    let thirdObject = {id: 5, name: 'five'}
    let array = new IndexArray(firstObject, secondObject, thirdObject)
    array.fetch({id: 1})
    let result = array.remove({id: 3})

    expect(result).toBe(array)
    expect(array.length).toEqual(2)
    expect(array[0]).toEqual(firstObject)
    expect(array[1]).toEqual(thirdObject)
    expect(array.indexes).toEqual({id: {1: 0, 5: 1}})
  })

  test('removes an object from indexed array by index', () => {
    let firstObject = {id: 1, name: 'one'}
    let secondObject = {id: 3, name: 'three'}
    let thirdObject = {id: 5, name: 'five'}
    let array = new IndexArray(firstObject, secondObject, thirdObject)
    array.fetch({id: 1})
    let result = array.remove(1)

    // expect(result).toBe(array)
    expect(array.length).toEqual(2)
    expect(array[0]).toEqual(firstObject)
    expect(array[1]).toEqual(thirdObject)
    expect(array.indexes).toEqual({id: {1: 0, 5: 1}})
  })
})

describe('clone', () => {
  test('returns a new instance of the same indexed array', () => {
    let array = new IndexArray({id: 1}, {id: 3})
    let clone = array.clone()
    expect(clone).not.toBe(array)
    expect(clone).toEqual(array)
  })
})

describe('proxy wrapper', () => {
  test('updates indexes when objects are updated', () => {
    let firstObject = {id: 1, name: 'one', description: 'first'}
    let secondObject = {id: 3, name: 'three', description: 'third'}
    let array = new IndexArray(firstObject, secondObject)

    let result = array.fetch({id: 1})
    result.id = 2
    result.name = 'two'
    expect(array.indexes).toEqual({id: {2: 0, 3: 1}})
    expect(array.fetch({id: 2})).toEqual({id: 2, name: 'two', description: 'first'})
  })
})