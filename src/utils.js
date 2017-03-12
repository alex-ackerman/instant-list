export function range(start, end) {
    return {
        map: function(fn) {
            const list = [];
            for (let i = start; i < end; i++) {
                list.push( fn(i) );
            }
            return list;
        },
        forEach: function(fn) {
            for (let i = start; i < end; i++) {
                fn(i);
            }
        },
        asList: function() {
            return this.map(i => i);
        }
    };
}

export const CHARS = [' '].concat(range(97, 123).map(chrCode => String.fromCharCode(chrCode)));

export function createRandomPicker(list) {
    return function() {
        const randomIdx = Math.floor( Math.random() * list.length );
        return list[randomIdx];
    }
}

const randomChr = createRandomPicker(CHARS);

function capitalizeSingle(str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function capitalize(str) {
    return str
        .split(/\s/)
        .map(capitalizeSingle)
        .join(' ');
}

class AccumulatingList {
    constructor(list = []) {
        this.list = list;
    }
    append(list) {
        for (let el of list) {
            this.list.push(el);
        }
        return this;
    }
    asList() {
        return this.list;
    }
}

function textToWords(text) {
    return text.split(/\n/)
        .map(line => line.split(/\s/))
        .reduce((words, line) => words.append(line), new AccumulatingList());
}

export const draculaWordsPromise = 
    fetch('dracula.txt')
        .then(response => response.text())
        .then(text => textToWords(text).asList())
        .then(words => words.map(word => word.replace(/[,.]/g, '')))
        .then(words => words.filter(word => word.length > 3))
        .then(words => words.filter(word => !(!!word.match(/[^a-zA-Z]/))));


export function uniq(list) {
    const uniq = new Set();
    for (let el of list) {
        if (!uniq.has(el)) {
            uniq.add(el);
        }
    }
    return uniq;
}


function createSequence(start = 1000) {
    return function() {
        return start++;
    }
}

export const globalSequence = createSequence();

export function randomString(len = 10) {
    return capitalize(range(0, len).map(() => randomChr()).join(''));
}

export const Sorter = {
    String: {
        asc: function(a, b) {
            return a > b;
        },
        desc: function(a, b) {
            return a <= b;
        }
    }
};