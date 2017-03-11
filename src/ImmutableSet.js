function copyObjectAsListExcept(obj, keysToExclude) {
    return Object.keys(obj).reduce((list, el) => {
        if (!keysToExclude[el]) {
            list.push(el);
        }
        return list;
    }, []);
}

export default class ImmutableSet {
    static of(list = []) {
        return new ImmutableSet(list);
    }
    constructor(list = []) {
        this._set = list.reduce((map, el) => {
            if (!map[el]) {
                map[el] = true;
            }
            return map;
        }, {});
    }
    asList() {
        return Object.keys(this._set);
    }
    add(el) {
        if (this._set[el]) {
            return this;
        }
        return this.addAll([el]);
    }
    remove(el) {
        if (!this._set[el]) {
            return this;
        }
        return new ImmutableSet( copyObjectAsListExcept(this._set, {[el]: true}) );
    }
    addAll(list = []) {
        const combinedList = Object.keys(this._set).concat(list);
        return new ImmutableSet(combinedList);
    }
    contains(el) {
        return !!this._set[el];
    }
    map(fn) {
        return this.asList().map(fn);
    }
    toString() {
        return `ImmutableSet(${this.asList()})`;
    }
}