

class IndexArray extends Array {
    constructor() {
        if (arguments.length === 1 && arguments[0] instanceof IndexArray) {
            let indexArray = arguments[0]
            super(...indexArray)
            this.indexes = indexArray.indexes
        } else {
            super()
            this.indexes = {}
            
            for (let item of arguments) {
                this.push(item)
            }
        }
    }

    _proxyWrap(item) {
        if (typeof item != 'object') return
        return new Proxy(item, {
            set: setHandler.bind(this)
        })
    }

    fetch(obj) {
        return this[this.fetchIndex(obj)]
    }

    fetchIndex(obj) {
        if (typeof obj === 'object' && Object.keys(obj).length === 1) {
            let key = Object.keys(obj)[0]
            if (!this.indexes[key]) {
                this.reindex(key)
            }
            return this.indexes[key][obj[key]]
        } else {
            return this.indexOf(obj)
        }
    }

    replace(obj, item) {
        let i = null
        if (typeof obj === 'object') {
            i = this.fetchIndex(obj)
        } else if (typeof obj === 'number') {
            i = obj
        }

        if (!(i > -1)) {
            return
        }

        let oldItem = this[i]

        this[i] = item
        for (let key in this.indexes) {
            let value = item[key]
            let oldValue = oldItem[key]
            this.indexes[key][value] = i

            delete this.indexes[key][oldValue]
            this.indexes[key][value] = i
        }

        return this
    }

    reindex(keys) {
        if (keys === undefined) {
            keys = Object.keys(this.indexes)
        } else if (!(keys instanceof Array)) {
            keys = [keys]
        }

        this.indexes = this.indexes || {}

        for (let key of keys) {
            let index = {}
            for (let i = this.length-1; i >= 0; i--) {
                let value = this[i][key]
                index[value] = i
            }
            this.indexes[key] = index
        }
    }

    push(item) {
        item = this._proxyWrap(item)
        let result = super.push(item)
        let i = this.length - 1
        for (let key in this.indexes) {
            let value = item[key]
            this.indexes[key][value] = i
        }
        return result
    }

    add(item) {
        this.push(item)
        return this
    }

    remove(arg) {
        let result = null
        if (typeof arg === 'object') {
            let i = this.fetchIndex(arg)
            if (i > -1) {
                result = this.splice(i, 1)[0]
            }

        } else if (typeof arg === 'number') {
            let i = arg
            result = this.splice(i, 1)[0]
        }

        if (result !== undefined && result !== null) {
            this.reindex()
        }

        return this
    }

    clone() {
        return new IndexArray(this)
    }

}

function setHandler(obj, prop, value) {

    let oldValue = obj[prop]
    if (this.indexes[prop]) {
        let i = this.indexes[prop][oldValue]
        delete this.indexes[prop][oldValue]
        this.indexes[prop][value] = i
    }

    return Reflect.set(obj, prop, value)
}

export default IndexArray